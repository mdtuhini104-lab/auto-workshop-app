<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
}

$user_id = get_user_id_from_token();

try {
    switch ($action) {
        // --- INTAKE & INSPECTIONS ---
        case 'create_customer':
            require_permission($pdo, $user_id, 'peoples', 'customers', true);
            $name = $input['name'];
            $phone = $input['phone'];
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO customers (name, phone) VALUES (?, ?)");
            $stmt->execute([$name, $phone]);
            $customer_id = $pdo->lastInsertId();
            $pdo->commit();
            
            echo json_encode(["success" => true, "id" => $customer_id, "message" => "Customer created"]);
            break;

        case 'create_vehicle':
            require_permission($pdo, $user_id, 'masterData', 'vehicles', true);
            $customer_id = $input['customer_id'];
            $make = $input['make'];
            $model = $input['model'];
            $license_plate = $input['license_plate'];
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO vehicles (customer_id, make, model, license_plate) VALUES (?, ?, ?, ?)");
            $stmt->execute([$customer_id, $make, $model, $license_plate]);
            $vehicle_id = $pdo->lastInsertId();
            $pdo->commit();
            
            echo json_encode(["success" => true, "id" => $vehicle_id, "message" => "Vehicle created"]);
            break;

        case 'search_customers':
            require_permission($pdo, $user_id, 'peoples', 'customers', false);
            $query = $_GET['q'] ?? '';
            if ($query) {
                $stmt = $pdo->prepare("SELECT id, name, phone FROM customers WHERE name LIKE ? OR phone LIKE ? LIMIT 10");
                $stmt->execute(["%$query%", "%$query%"]);
            } else {
                $stmt = $pdo->query("SELECT id, name, phone FROM customers LIMIT 10");
            }
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case 'get_vehicles_by_customer':
            require_permission($pdo, $user_id, 'masterData', 'vehicles', false);
            $customer_id = $_GET['customer_id'] ?? 0;
            $stmt = $pdo->prepare("SELECT id, license_plate, model, chassis_number FROM vehicles WHERE customer_id = ?");
            $stmt->execute([$customer_id]);
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case 'get_pending_inspections':
            require_permission($pdo, $user_id, 'workshop', 'inspections', false);
            $stmt = $pdo->query("SELECT vi.*, v.make, v.model, v.license_plate, c.name FROM vehicle_intake vi JOIN vehicles v ON vi.vehicle_id = v.id JOIN customers c ON v.customer_id = c.id WHERE vi.status = 'Pending Inspection'");
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case 'log_inspection':
            require_permission($pdo, $user_id, 'workshop', 'inspections', true);
            $intake_id = $input['intake_id'];
            $findings = $input['findings'];
            $items = $input['items'] ?? [];
            
            $pdo->beginTransaction();
            $iStmt = $pdo->prepare("INSERT INTO inspections (intake_id, mechanic_id, findings) VALUES (?, 1, ?)");
            $iStmt->execute([$intake_id, $findings]);
            $inspection_id = $pdo->lastInsertId();

            if (!empty($items)) {
                $itemStmt = $pdo->prepare("INSERT INTO inspection_items (inspection_id, description, part_source, part_id, quantity, service_charge, service_category) VALUES (?, ?, ?, ?, ?, ?, ?)");
                foreach ($items as $item) {
                    $itemStmt->execute([
                        $inspection_id, 
                        $item['description'], 
                        $item['part_source'], 
                        $item['part_id'] ?: null, 
                        $item['quantity'], 
                        $item['service_charge'],
                        $item['service_category'] ?? 'None'
                    ]);
                    
                    // Ad-Hoc Procurement Rule: Stage a Purchase Order if 'Local Procurement'
                    if ($item['part_source'] === 'Local Procurement') {
                        $poStmt = $pdo->prepare("INSERT INTO purchase_orders (vendor_name, part_name, quantity, rate) VALUES (?, ?, ?, ?)");
                        $poStmt->execute([
                            $item['external_vendor'] ?? 'Unknown Vendor',
                            $item['description'],
                            $item['quantity'],
                            $item['external_rate'] ?? 0.00
                        ]);
                    }
                }
            }
            $pdo->prepare("UPDATE vehicle_intake SET status = 'Inspected' WHERE id = ?")->execute([$intake_id]);
            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Inspection and Quotation logged successfully"]);
            break;

        // --- QUOTATIONS ---
        case 'log_quotation':
            require_permission($pdo, $user_id, 'workshop', 'quotations', true);
            $intake_id = $input['intake_id'] ?? null;
            $quoted_by = $input['quoted_by'] ?? 'Mamun Automobiles';
            $grand_total = $input['grand_total'] ?? 0;
            $status = $input['status'] ?? 'Draft'; // Allow direct Sent/Draft
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO quotations (intake_id, quoted_by, grand_total, status) VALUES (?, ?, ?, ?)");
            $stmt->execute([$intake_id, $quoted_by, $grand_total, $status]);
            $quotation_id = $pdo->lastInsertId();

            // Atomic transaction to update the target vehicle's state
            if ($intake_id) {
                $vehicleStmt = $pdo->prepare("UPDATE vehicles v JOIN vehicle_intake vi ON v.id = vi.vehicle_id SET v.status = 'Quoted' WHERE vi.id = ?");
                $vehicleStmt->execute([$intake_id]);
            }
            
            $pdo->commit();
            
            echo json_encode(["success" => true, "message" => "Quotation saved", "quotation_id" => $quotation_id]);
            break;

        case 'approve_quotation':
            require_permission($pdo, $user_id, 'workshop', 'quotations', true);
            $quotation_id = $input['quotation_id'] ?? null;
            if (!$quotation_id) throw new Exception("Quotation ID is required.");

            $pdo->beginTransaction();
            $stmt = $pdo->prepare("UPDATE quotations SET status = 'Approved' WHERE id = ?");
            $stmt->execute([$quotation_id]);

            // Update vehicle status to Quote Approved
            $vehicleStmt = $pdo->prepare("UPDATE vehicles v JOIN vehicle_intake vi ON v.id = vi.vehicle_id JOIN quotations q ON vi.id = q.intake_id SET v.status = 'Quote Approved' WHERE q.id = ?");
            $vehicleStmt->execute([$quotation_id]);

            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Quotation approved and vehicle state updated."]);
            break;

        case 'get_pending_quotations':
            require_permission($pdo, $user_id, 'workshop', 'quotations', false);
            $stmt = $pdo->query("
                SELECT i.id as inspection_id, i.findings, vi.driver_complaints, v.make, v.license_plate 
                FROM inspections i
                JOIN vehicle_intake vi ON i.intake_id = vi.id
                JOIN vehicles v ON vi.vehicle_id = v.id
                WHERE vi.status = 'Inspected'
            ");
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        // --- JOB CARDS & WORK ORDERS ---
        case 'get_work_orders':
            require_permission($pdo, $user_id, 'workshop', 'work-orders', false);
            $stmt = $pdo->query("SELECT wo.*, v.make as vehicle_details FROM work_orders wo JOIN quotations q ON wo.quotation_id = q.id JOIN vehicle_intake vi ON q.intake_id = vi.id JOIN vehicles v ON vi.vehicle_id = v.id ORDER BY wo.start_date DESC");
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        // --- FINAL INVOICING & BILLING ---
        case 'get_completed_work_orders':
            require_permission($pdo, $user_id, 'workshop', 'billing', false);
            // Fetch work orders where job cards are done, to generate invoice
            $stmt = $pdo->query("SELECT wo.id, wo.quotation_id, v.license_plate FROM work_orders wo JOIN quotations q ON wo.quotation_id = q.id JOIN vehicle_intake vi ON q.intake_id = vi.id JOIN vehicles v ON vi.vehicle_id = v.id WHERE wo.status = 'Completed' AND wo.id NOT IN (SELECT work_order_id FROM invoices)");
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case 'create_invoice':
            require_permission($pdo, $user_id, 'workshop', 'billing', true);
            $work_order_id = !empty($input['work_order_id']) ? intval($input['work_order_id']) : null;
            $customer_id = intval($input['customer_id'] ?? 0);
            $billed_by = strval($input['billed_by'] ?? 'Mamun Automobiles');
            $items = $input['items'] ?? [];

            // Server-side financial re-calculation & sanitization: compute subtotal from item lines
            $subtotal = 0.0;
            $sanitized_items = [];
            foreach ($items as $item) {
                $qty = floatval($item['quantity'] ?? 0);
                $rate = floatval($item['rate'] ?? 0);
                $item_total = $qty * $rate;
                $subtotal += $item_total;
                $sanitized_items[] = [
                    'description' => strval($item['description'] ?? ''),
                    'quantity' => $qty,
                    'rate' => $rate,
                    'total' => $item_total
                ];
            }

            $discount_amount = floatval($input['discount_amount'] ?? 0);
            $paid_amount = floatval($input['paid_amount'] ?? 0);
            $grand_total = max(0.0, $subtotal - $discount_amount);
            $balance_due = max(0.0, $grand_total - $paid_amount);
            $sale_type = ($paid_amount >= $grand_total) ? 'Cash Sale' : 'Credit Sale';
            $status = ($balance_due == 0.0) ? 'Paid' : 'Unpaid';

            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO invoices (work_order_id, customer_id, billed_by, sale_type, subtotal, discount_amount, grand_total, paid_amount, balance_due, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$work_order_id, $customer_id, $billed_by, $sale_type, $subtotal, $discount_amount, $grand_total, $paid_amount, $balance_due, $status]);
            $invoice_id = $pdo->lastInsertId();

            if (!empty($sanitized_items)) {
                $itemStmt = $pdo->prepare("INSERT INTO invoice_items (invoice_id, description, quantity, rate, total) VALUES (?, ?, ?, ?, ?)");
                foreach ($sanitized_items as $sItem) {
                    $itemStmt->execute([$invoice_id, $sItem['description'], $sItem['quantity'], $sItem['rate'], $sItem['total']]);
                }
            }

            if ($balance_due > 0) {
                $ledgerStmt = $pdo->prepare("INSERT INTO customer_ledger (customer_id, invoice_id, transaction_type, amount) VALUES (?, ?, 'Debit', ?)");
                $ledgerStmt->execute([$customer_id, $invoice_id, $balance_due]);
            }
            $pdo->commit();

            echo json_encode(["success" => true, "message" => "Invoice generated successfully", "invoice_id" => $invoice_id, "balance_due" => $balance_due]);
            break;

        case 'check_historical_rate':
            require_permission($pdo, $user_id, 'workshop', 'billing', false);
            $customer_id = intval($input['customer_id'] ?? $_GET['customer_id'] ?? 0);
            $description = strval($input['description'] ?? $_GET['description'] ?? '');
            
            $stmt = $pdo->prepare("SELECT rate FROM invoice_items JOIN invoices ON invoice_items.invoice_id = invoices.id WHERE invoices.customer_id = ? AND invoice_items.description = ? ORDER BY invoices.issued_at DESC LIMIT 1");
            $stmt->execute([$customer_id, $description]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result) {
                echo json_encode(["success" => true, "locked_rate" => floatval($result['rate'])]);
            } else {
                echo json_encode(["success" => false, "message" => "No historical rate found"]);
            }
            break;

        case 'apply_post_discount':
            require_permission($pdo, $user_id, 'workshop', 'billing', true);
            $invoice_id = intval($input['invoice_id'] ?? 0);
            $new_discount = floatval($input['discount_amount'] ?? 0);
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("SELECT customer_id, subtotal, paid_amount, balance_due FROM invoices WHERE id = ?");
            $stmt->execute([$invoice_id]);
            $invoice = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($invoice) {
                $subtotal = floatval($invoice['subtotal'] ?? 0);
                $paid_amount = floatval($invoice['paid_amount'] ?? 0);
                $new_grand_total = max(0.0, $subtotal - $new_discount);
                $new_balance = max(0.0, $new_grand_total - $paid_amount);
                $new_sale_type = ($paid_amount >= $new_grand_total) ? 'Cash Sale' : 'Credit Sale';
                $new_status = ($new_balance == 0.0) ? 'Paid' : 'Unpaid';
                
                $update = $pdo->prepare("UPDATE invoices SET discount_amount = ?, grand_total = ?, balance_due = ?, sale_type = ?, status = ? WHERE id = ?");
                $update->execute([$new_discount, $new_grand_total, $new_balance, $new_sale_type, $new_status, $invoice_id]);
                
                // Remove old ledger entry for this invoice and insert new if balance > 0
                $pdo->prepare("DELETE FROM customer_ledger WHERE invoice_id = ?")->execute([$invoice_id]);
                if ($new_balance > 0) {
                    $ledgerStmt = $pdo->prepare("INSERT INTO customer_ledger (customer_id, invoice_id, transaction_type, amount) VALUES (?, ?, 'Debit', ?)");
                    $ledgerStmt->execute([$invoice['customer_id'], $invoice_id, $new_balance]);
                }
                
                $pdo->commit();
                echo json_encode(["success" => true, "message" => "Discount applied and ledger updated", "new_grand_total" => $new_grand_total]);
            } else {
                $pdo->rollBack();
                echo json_encode(["success" => false, "message" => "Invoice not found"]);
            }
            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Invalid action specified."]);
            break;
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Transaction error: " . $e->getMessage()]);
}
?>
