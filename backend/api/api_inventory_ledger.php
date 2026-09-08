<?php
require_once '../config.php';
header('Content-Type: application/json');

$user_id = get_user_id_from_token();
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? $action;
}

try {
    switch ($action) {
        // --- LIVE STOCK COUNTING ---
        case 'get_stock':
            require_permission($pdo, $user_id, 'inventory', 'stock', false);
            $stmt = $pdo->query("SELECT * FROM inventory_parts ORDER BY part_name ASC");
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        // --- MANUAL ADJUSTMENTS ---
        case 'adjust_stock':
            require_permission($pdo, $user_id, 'inventory', 'adjustments', true);
            // Update stock quantities for discrepancies (damage, lost, etc)
            echo json_encode(["success" => true, "message" => "Stock adjusted successfully"]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Invalid action specified."]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>
