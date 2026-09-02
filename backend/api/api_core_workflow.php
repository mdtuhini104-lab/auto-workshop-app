<?php
require_once '../config.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$user_id = get_user_id_from_token();

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        case 'update_inspection':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'quotations', 'inspections', true);
            $data = json_decode(file_get_contents("php://input"));
            
            if (empty($data->inspection_id)) {
                throw new Exception("Inspection ID is required.");
            }

            $pdo->beginTransaction();
            
            // Update Inspection main record
            $stmt = $pdo->prepare("UPDATE inspections SET customer_id = ?, vehicle_id = ?, mechanic_id = ?, customer_requirement = ?, mechanic_report = ?, status = ? WHERE id = ?");
            $stmt->execute([
                $data->customer_id,
                $data->vehicle_id,
                $data->mechanic_id ?? null,
                $data->customer_requirement ?? '',
                $data->mechanic_report ?? '',
                $data->status ?? 'Open',
                $data->inspection_id
            ]);
            
            // 1. Re-insert Problems
            $pdo->prepare("DELETE FROM inspection_problems WHERE inspection_id = ?")->execute([$data->inspection_id]);
            if (isset($data->problems) && is_array($data->problems)) {
                $stmt_prob = $pdo->prepare("INSERT INTO inspection_problems (inspection_id, problem_title, description, severity, suggested_service_id, est_cost) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($data->problems as $prob) {
                    if (!empty($prob->problem_title)) {
                        $stmt_prob->execute([
                            $data->inspection_id,
                            $prob->problem_title,
                            $prob->description ?? '',
                            $prob->severity ?? 'Medium',
                            $prob->suggested_service_id ?? null,
                            $prob->est_cost ?? 0
                        ]);
                    }
                }
            }
            
            // 2. Re-insert Items
            $pdo->prepare("DELETE FROM inspection_items WHERE inspection_id = ?")->execute([$data->inspection_id]);
            if (isset($data->items) && is_array($data->items)) {
                $stmt_item = $pdo->prepare("INSERT INTO inspection_items (inspection_id, item_id, quantity) VALUES (?, ?, ?)");
                foreach ($data->items as $item) {
                    if (!empty($item->item_id)) {
                        $stmt_item->execute([
                            $data->inspection_id,
                            $item->item_id,
                            $item->quantity ?? 1
                        ]);
                    }
                }
            }
            
            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Inspection updated successfully"]);
            break;

        case 'update_job_card':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'workshop', 'job-cards', true);
            $data = json_decode(file_get_contents("php://input"));
            
            if (empty($data->job_card_id)) {
                throw new Exception("Job Card ID is required.");
            }

            $pdo->beginTransaction();
            
            // Update main job card
            $stmt = $pdo->prepare("UPDATE job_cards SET mechanic_id = ?, status = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                $data->mechanic_id ?? null,
                $data->status ?? 'In Progress',
                $data->job_card_id
            ]);
            
            // Process Job Card Items (Inventory Reconciliation)
            if (isset($data->items) && is_array($data->items)) {
                foreach ($data->items as $item) {
                    if (empty($item->item_id)) continue;
                    
                    // Fetch existing item to calculate delta
                    $existing_stmt = $pdo->prepare("SELECT quantity FROM job_card_items WHERE job_card_id = ? AND item_id = ?");
                    $existing_stmt->execute([$data->job_card_id, $item->item_id]);
                    $existing = $existing_stmt->fetch(PDO::FETCH_ASSOC);
                    
                    $old_qty = $existing ? (float)$existing['quantity'] : 0;
                    $new_qty = (float)($item->quantity ?? 0);
                    $delta = $new_qty - $old_qty;
                    
                    if ($existing) {
                        // Update existing row
                        $upd_item = $pdo->prepare("UPDATE job_card_items SET quantity = ?, mechanic_id = ? WHERE job_card_id = ? AND item_id = ?");
                        $upd_item->execute([$new_qty, $item->mechanic_id ?? null, $data->job_card_id, $item->item_id]);
                    } else {
                        // Insert new row
                        $ins_item = $pdo->prepare("INSERT INTO job_card_items (job_card_id, item_id, quantity, mechanic_id) VALUES (?, ?, ?, ?)");
                        $ins_item->execute([$data->job_card_id, $item->item_id, $new_qty, $item->mechanic_id ?? null]);
                    }
                    
                    // Stock adjustment (if delta != 0)
                    if ($delta != 0) {
                        $stock_stmt = $pdo->prepare("SELECT stock_quantity FROM items WHERE id = ? FOR UPDATE");
                        $stock_stmt->execute([$item->item_id]);
                        $item_data = $stock_stmt->fetch(PDO::FETCH_ASSOC);
                        
                        if ($item_data) {
                            $current_stock = (float)$item_data['stock_quantity'];
                            $new_stock = $current_stock - $delta;
                            
                            if ($new_stock < 0) {
                                throw new Exception("Insufficient stock for item ID: {$item->item_id}");
                            }
                            
                            $upd_stock = $pdo->prepare("UPDATE items SET stock_quantity = ? WHERE id = ?");
                            $upd_stock->execute([$new_stock, $item->item_id]);
                            
                            // Log in inventory_ledger
                            $ledger = $pdo->prepare("INSERT INTO inventory_ledger (item_id, reference_id, transaction_type, quantity, previous_stock, new_stock, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
                            $tx_type = $delta > 0 ? 'Consumption' : 'Return';
                            $ledger->execute([
                                $item->item_id,
                                $data->job_card_id,
                                $tx_type,
                                abs($delta),
                                $current_stock,
                                $new_stock,
                                $user_id
                            ]);
                        }
                    }
                }
            }
            
            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Job Card updated successfully"]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Invalid action"]);
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
