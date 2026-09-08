<?php
require_once '../config.php';
header('Content-Type: application/json');

$user_id = get_user_id_from_token();
// In demo/offline environment allow user_id 1 as fallback if token is not parsed
if (!$user_id) {
    $user_id = 1;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && empty($action)) {
    $raw_input = file_get_contents('php://input');
    $parsed_json = json_decode($raw_input, true);
    $action = $parsed_json['action'] ?? '';
}

try {
    switch ($action) {
        // --- 1. FETCH VEHICLE OWNERSHIP HISTORY ---
        case 'get_vehicle_ownership_history':
            $vehicle_id = intval($_GET['vehicle_id'] ?? 0);
            if (!$vehicle_id) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Vehicle ID is required"]);
                exit();
            }

            // Fetch vehicle and current active owner info
            $veh_stmt = $pdo->prepare("
                SELECT v.*, 
                       c.name AS current_owner_name, 
                       c.phone AS current_owner_phone,
                       c.email AS current_owner_email
                FROM vehicles v
                LEFT JOIN customers c ON COALESCE(v.current_owner_id, v.customer_id) = c.id
                WHERE v.id = ?
            ");
            $veh_stmt->execute([$vehicle_id]);
            $vehicle = $veh_stmt->fetch(PDO::FETCH_ASSOC);

            if (!$vehicle) {
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "Vehicle not found"]);
                exit();
            }

            // Fetch ownership timeline
            $history_stmt = $pdo->prepare("
                SELECT voh.*, 
                       c.name AS customer_name, 
                       c.phone AS customer_phone, 
                       c.email AS customer_email,
                       u.username AS transferred_by_user
                FROM vehicle_ownership_history voh
                JOIN customers c ON voh.customer_id = c.id
                LEFT JOIN users u ON voh.transferred_by = u.id
                WHERE voh.vehicle_id = ?
                ORDER BY voh.ownership_start_date DESC, voh.id DESC
            ");
            $history_stmt->execute([$vehicle_id]);
            $timeline = $history_stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch audit logs
            $audit_stmt = $pdo->prepare("
                SELECT al.*, 
                       prev_c.name AS previous_owner_name, 
                       new_c.name AS new_owner_name,
                       u.username AS transferred_by_user
                FROM vehicle_transfer_audit_logs al
                LEFT JOIN customers prev_c ON al.previous_owner_id = prev_c.id
                LEFT JOIN customers new_c ON al.new_owner_id = new_c.id
                LEFT JOIN users u ON al.transferred_by = u.id
                WHERE al.vehicle_id = ?
                ORDER BY al.created_at DESC
            ");
            $audit_stmt->execute([$vehicle_id]);
            $audit_logs = $audit_stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch chronological service history with linked owner at that time
            $services_stmt = $pdo->prepare("
                SELECT 'Quotation' AS service_type,
                       q.id,
                       q.quotation_no AS reference_no,
                       q.quotation_date AS service_date,
                       q.grand_total AS amount,
                       q.status,
                       q.customer_id,
                       c.name AS owner_name,
                       COALESCE(q.ownership_id, 0) AS ownership_id
                FROM quotations q
                LEFT JOIN customers c ON q.customer_id = c.id
                WHERE q.vehicle_id = ?
                
                UNION ALL
                
                SELECT 'Inspection' AS service_type,
                       i.id,
                       CONCAT('INSP-', i.id) AS reference_no,
                       DATE(i.created_at) AS service_date,
                       0.00 AS amount,
                       i.status,
                       i.customer_id,
                       c.name AS owner_name,
                       0 AS ownership_id
                FROM inspections i
                LEFT JOIN customers c ON i.customer_id = c.id
                WHERE i.vehicle_id = ?
                
                ORDER BY service_date DESC, id DESC
            ");
            $services_stmt->execute([$vehicle_id, $vehicle_id]);
            $service_history = $services_stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "vehicle" => $vehicle,
                "timeline" => $timeline,
                "audit_logs" => $audit_logs,
                "service_history" => $service_history
            ]);
            break;

        // --- 2. GET CUSTOMER OWNED VEHICLES (CURRENT VS PREVIOUS) ---
        case 'get_customer_vehicles':
            $customer_id = intval($_GET['customer_id'] ?? 0);
            if (!$customer_id) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Customer ID is required"]);
                exit();
            }

            // Currently Owned Vehicles: active ownership in vehicle_ownership_history OR current_owner_id / customer_id
            $curr_stmt = $pdo->prepare("
                SELECT v.*,
                       voh.id AS active_ownership_id,
                       voh.ownership_start_date,
                       voh.ownership_status
                FROM vehicles v
                LEFT JOIN vehicle_ownership_history voh 
                       ON voh.vehicle_id = v.id 
                      AND voh.customer_id = ? 
                      AND voh.ownership_status = 'Active'
                WHERE (COALESCE(v.current_owner_id, v.customer_id) = ? OR voh.id IS NOT NULL)
                GROUP BY v.id
                ORDER BY v.id DESC
            ");
            $curr_stmt->execute([$customer_id, $customer_id]);
            $current_vehicles = $curr_stmt->fetchAll(PDO::FETCH_ASSOC);

            // Previously Owned Vehicles: ownership_status = 'Previous' for this customer
            $prev_stmt = $pdo->prepare("
                SELECT v.*,
                       voh.id AS past_ownership_id,
                       voh.ownership_start_date,
                       voh.ownership_end_date,
                       voh.transfer_reason,
                       c_curr.name AS new_current_owner_name
                FROM vehicle_ownership_history voh
                JOIN vehicles v ON voh.vehicle_id = v.id
                LEFT JOIN customers c_curr ON COALESCE(v.current_owner_id, v.customer_id) = c_curr.id
                WHERE voh.customer_id = ? 
                  AND voh.ownership_status = 'Previous'
                  AND COALESCE(v.current_owner_id, v.customer_id) != ?
                ORDER BY voh.ownership_end_date DESC
            ");
            $prev_stmt->execute([$customer_id, $customer_id]);
            $previous_vehicles = $prev_stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                "success" => true,
                "currently_owned" => $current_vehicles,
                "previously_owned" => $previous_vehicles
            ]);
            break;

        // --- 3. ATOMIC OWNERSHIP TRANSFER ---
        case 'transfer_ownership':
            if ($method !== 'POST') {
                http_response_code(405);
                echo json_encode(["success" => false, "error" => "Method not allowed. Use POST."]);
                exit();
            }

            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $vehicle_id = intval($input['vehicle_id'] ?? 0);
            $new_customer_id = intval($input['new_customer_id'] ?? 0);
            $transfer_date = !empty($input['transfer_date']) ? $input['transfer_date'] : date('Y-m-d');
            $transfer_reason = trim($input['transfer_reason'] ?? 'Vehicle Sold / Ownership Change');
            $transfer_reference = trim($input['transfer_reference'] ?? '');
            $notes = trim($input['notes'] ?? '');

            if (!$vehicle_id || !$new_customer_id) {
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "Both vehicle_id and new_customer_id are required."]);
                exit();
            }

            $pdo->beginTransaction();

            // 1. Validate vehicle exists & lock for update
            $veh_check = $pdo->prepare("SELECT * FROM vehicles WHERE id = ? FOR UPDATE");
            $veh_check->execute([$vehicle_id]);
            $vehicle = $veh_check->fetch(PDO::FETCH_ASSOC);
            if (!$vehicle) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "Vehicle record not found."]);
                exit();
            }

            // Identify current owner
            $current_owner_id = intval($vehicle['current_owner_id'] ?? $vehicle['customer_id'] ?? 0);

            // 2. Validate new customer exists
            $cust_check = $pdo->prepare("SELECT id, name FROM customers WHERE id = ?");
            $cust_check->execute([$new_customer_id]);
            $new_customer = $cust_check->fetch(PDO::FETCH_ASSOC);
            if (!$new_customer) {
                $pdo->rollBack();
                http_response_code(404);
                echo json_encode(["success" => false, "error" => "New customer does not exist."]);
                exit();
            }

            // Validate that new owner is different from current owner
            if ($current_owner_id === $new_customer_id) {
                $pdo->rollBack();
                http_response_code(400);
                echo json_encode(["success" => false, "error" => "The selected customer is already the active owner of this vehicle."]);
                exit();
            }

            // STEP A: Close previous ownership record in vehicle_ownership_history
            if ($current_owner_id > 0) {
                $close_stmt = $pdo->prepare("
                    UPDATE vehicle_ownership_history 
                    SET ownership_status = 'Previous', 
                        ownership_end_date = ?,
                        transfer_reason = COALESCE(NULLIF(?, ''), transfer_reason)
                    WHERE vehicle_id = ? AND customer_id = ? AND ownership_status = 'Active'
                ");
                $close_stmt->execute([$transfer_date, $transfer_reason, $vehicle_id, $current_owner_id]);
            }

            // STEP B: Insert new record into vehicle_ownership_history (Active)
            $insert_hist = $pdo->prepare("
                INSERT INTO vehicle_ownership_history (
                    vehicle_id, customer_id, ownership_start_date, ownership_status, 
                    transfer_reason, transfer_reference, notes, transferred_by
                ) VALUES (?, ?, ?, 'Active', ?, ?, ?, ?)
            ");
            $insert_hist->execute([
                $vehicle_id,
                $new_customer_id,
                $transfer_date,
                $transfer_reason,
                $transfer_reference,
                $notes,
                $user_id
            ]);
            $new_ownership_id = $pdo->lastInsertId();

            // STEP C: Update vehicles table current_owner_id and customer_id
            $update_veh = $pdo->prepare("
                UPDATE vehicles 
                SET current_owner_id = ?, 
                    customer_id = ? 
                WHERE id = ?
            ");
            $update_veh->execute([$new_customer_id, $new_customer_id, $vehicle_id]);

            // STEP D: Insert immutable audit log into vehicle_transfer_audit_logs
            $transfer_uuid = 'TRF-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
            $audit_stmt = $pdo->prepare("
                INSERT INTO vehicle_transfer_audit_logs (
                    transfer_id, vehicle_id, previous_owner_id, new_owner_id, 
                    transfer_date, transferred_by, reason, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $audit_stmt->execute([
                $transfer_uuid,
                $vehicle_id,
                $current_owner_id,
                $new_customer_id,
                $transfer_date,
                $user_id,
                $transfer_reason,
                $notes
            ]);

            // Note: Past invoices, payments, and ledger balances remain strictly untouched!
            $pdo->commit();

            echo json_encode([
                "success" => true,
                "message" => "Vehicle ownership transferred successfully.",
                "transfer_id" => $transfer_uuid,
                "ownership_id" => $new_ownership_id,
                "vehicle_id" => $vehicle_id,
                "previous_owner_id" => $current_owner_id,
                "new_owner_id" => $new_customer_id,
                "transfer_date" => $transfer_date
            ]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Invalid action specified."]);
            break;
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Internal Server Error: " . $e->getMessage()]);
}
?>
