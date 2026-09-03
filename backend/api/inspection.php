<?php
// backend/api/inspection.php
require_once __DIR__ . '/../config.php';

// Dynamic CORS - reflects requesting origin, supports credentials & preflight
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}

header('Content-Type: application/json');

// Cryptographic JWT validation
$user_id = get_user_id_from_token();
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized: Cryptographic JWT signature verification failed or token expired."]);
    exit();
}

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

    $intake_id = intval($data->intake_id);
    $mechanic_id = intval($data->mechanic_id);
    $findings = strval($data->findings ?? '');

    // 1. Insert Inspection
    $stmt = $pdo->prepare("INSERT INTO inspections (intake_id, mechanic_id, findings) VALUES (?, ?, ?)");
    $stmt->execute([$intake_id, $mechanic_id, $findings]);
    $inspection_id = $pdo->lastInsertId();

    // 2. Insert Inspection Items (Parts/Services)
    $stmtItem = $pdo->prepare("INSERT INTO inspection_items (inspection_id, part_id, description, part_source, quantity, service_charge) VALUES (?, ?, ?, ?, ?, ?)");
    
    foreach ($data->items as $item) {
        $part_source = in_array($item->part_source ?? '', ['Inventory', 'Customer']) ? $item->part_source : 'Inventory';
        $part_id = !empty($item->part_id) ? intval($item->part_id) : null;
        $description = strval($item->description ?? '');
        $quantity = floatval($item->quantity ?? 1);
        $service_charge = floatval($item->service_charge ?? 0.00);
        
        $stmtItem->execute([
            $inspection_id,
            $part_id,
            $description,
            $part_source,
            $quantity,
            $service_charge
        ]);
    }

    // 3. Update Vehicle Intake status
    $stmtUpdate = $pdo->prepare("UPDATE vehicle_intake SET status = 'Inspected' WHERE id = ?");
    $stmtUpdate->execute([$intake_id]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Inspection saved successfully",
        "inspection_id" => $inspection_id
    ]);

} catch (\Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Failed to save inspection: " . $e->getMessage()]);
}
?>
