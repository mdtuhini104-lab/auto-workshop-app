<?php
// backend/api/inspection.php
require_once '../config.php';

header('Content-Type: application/json');

// Extremely basic JWT validation for boilerplate purposes
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (strpos($authHeader, 'Bearer ') !== 0) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

// In a real app, you MUST decode and verify the JWT signature here.
// For this boilerplate, we assume authentication passes if a token is present.
// $jwt = substr($authHeader, 7);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->intake_id) || !isset($data->mechanic_id) || !isset($data->items)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit();
}

try {
    $pdo->beginTransaction();

    // 1. Insert Inspection
    $stmt = $pdo->prepare("INSERT INTO inspections (intake_id, mechanic_id, findings) VALUES (?, ?, ?)");
    $stmt->execute([$data->intake_id, $data->mechanic_id, $data->findings ?? '']);
    $inspection_id = $pdo->lastInsertId();

    // 2. Insert Inspection Items (Parts/Services)
    $stmtItem = $pdo->prepare("INSERT INTO inspection_items (inspection_id, part_id, description, part_source, quantity, service_charge) VALUES (?, ?, ?, ?, ?, ?)");
    
    foreach ($data->items as $item) {
        $part_source = in_array($item->part_source, ['Inventory', 'Customer']) ? $item->part_source : 'Inventory';
        
        $stmtItem->execute([
            $inspection_id,
            isset($item->part_id) ? $item->part_id : null,
            $item->description,
            $part_source,
            $item->quantity ?? 1,
            $item->service_charge ?? 0.00
        ]);
    }

    // 3. Update Vehicle Intake status
    $stmtUpdate = $pdo->prepare("UPDATE vehicle_intake SET status = 'Inspected' WHERE id = ?");
    $stmtUpdate->execute([$data->intake_id]);

    $pdo->commit();

    echo json_encode(["message" => "Inspection saved successfully", "inspection_id" => $inspection_id]);

} catch (\Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Failed to save inspection: " . $e->getMessage()]);
}
?>
