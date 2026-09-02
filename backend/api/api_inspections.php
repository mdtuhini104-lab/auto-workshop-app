<?php
require_once '../config.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$user_id = get_user_id_from_token();

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        case 'get_inspections':
            require_permission($pdo, $user_id, 'quotations', 'inspections', false);
            
            // Join with customers, vehicles
            $sql = "SELECT i.*, 
                           c.customer_name, c.phone as customer_phone,
                           v.plate_number, v.brand, v.model,
                           (SELECT COUNT(*) FROM inspection_problems WHERE inspection_id = i.id) as problems_count
                    FROM inspections i
                    LEFT JOIN customers c ON i.customer_id = c.id
                    LEFT JOIN vehicles v ON i.vehicle_id = v.id
                    ORDER BY i.id DESC";
                    
            $stmt = $pdo->query($sql);
            echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
            break;

        case 'save_inspection':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'quotations', 'inspections', true);
            $data = json_decode(file_get_contents("php://input"));
            
            if (!$data->customer_id || !$data->vehicle_id) {
                throw new Exception("Customer and Vehicle are required.");
            }

            $pdo->beginTransaction();
            
            // Insert Inspection
            $stmt = $pdo->prepare("INSERT INTO inspections (customer_id, vehicle_id, mechanic_id, customer_requirement, mechanic_report, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data->customer_id,
                $data->vehicle_id,
                $data->mechanic_id ?? null,
                $data->customer_requirement ?? '',
                $data->mechanic_report ?? '',
                $data->status ?? 'Open',
                $user_id
            ]);
            
            $inspection_id = $pdo->lastInsertId();
            
            // Insert Problems
            if (isset($data->problems) && is_array($data->problems)) {
                $stmt_prob = $pdo->prepare("INSERT INTO inspection_problems (inspection_id, problem_title, description, severity, suggested_service_id, est_cost) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($data->problems as $prob) {
                    if (!empty($prob->problem_title)) {
                        $stmt_prob->execute([
                            $inspection_id,
                            $prob->problem_title,
                            $prob->description ?? '',
                            $prob->severity ?? 'Medium',
                            $prob->suggested_service_id ?? null,
                            $prob->est_cost ?? 0
                        ]);
                    }
                }
            }
            
            // Insert Items
            if (isset($data->items) && is_array($data->items)) {
                $stmt_item = $pdo->prepare("INSERT INTO inspection_items (inspection_id, item_id, quantity) VALUES (?, ?, ?)");
                foreach ($data->items as $item) {
                    if (!empty($item->item_id)) {
                        $stmt_item->execute([
                            $inspection_id,
                            $item->item_id,
                            $item->quantity ?? 1
                        ]);
                    }
                }
            }
            
            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Inspection saved successfully", "inspection_id" => $inspection_id]);
            break;

        case 'quick_add_customer':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'quotations', 'inspections', true);
            $data = json_decode(file_get_contents("php://input"));
            
            if (empty($data->customer_name)) throw new Exception("Customer name is required.");
            
            $stmt = $pdo->prepare("INSERT INTO customers (customer_name, phone, created_by) VALUES (?, ?, ?)");
            $stmt->execute([$data->customer_name, $data->phone ?? '', $user_id]);
            $id = $pdo->lastInsertId();
            
            echo json_encode(["success" => true, "customer" => ["id" => $id, "customer_name" => $data->customer_name, "phone" => $data->phone]]);
            break;
            
        case 'quick_add_vehicle':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'quotations', 'inspections', true);
            $data = json_decode(file_get_contents("php://input"));
            
            if (empty($data->plate_number)) throw new Exception("Plate number is required.");
            
            $stmt = $pdo->prepare("INSERT INTO vehicles (plate_number, customer_id, brand, model, year, created_by) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data->plate_number,
                $data->customer_id ?? null,
                $data->brand ?? '',
                $data->model ?? '',
                $data->year ?? date('Y'),
                $user_id
            ]);
            $id = $pdo->lastInsertId();
            
            echo json_encode(["success" => true, "vehicle" => [
                "id" => $id, 
                "plate_number" => $data->plate_number, 
                "brand" => $data->brand,
                "model" => $data->model
            ]]);
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
