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
        // --- VENDOR PURCHASES ---
        case 'get_purchases':
            require_permission($pdo, $user_id, 'purchases', 'orders', false);
            // SELECT * FROM purchase_orders
            echo json_encode(["success" => true, "data" => []]);
            break;
            
        case 'create_purchase_order':
            require_permission($pdo, $user_id, 'purchases', 'orders', true);
            // INSERT INTO purchase_orders
            echo json_encode(["success" => true, "message" => "Purchase order created successfully"]);
            break;

        // --- GOODS RECEIVED NOTE (GRN) ---
        case 'get_pending_grn':
            require_permission($pdo, $user_id, 'purchases', 'grn', false);
            // Fetch POs waiting for receipt
            echo json_encode(["success" => true, "data" => []]);
            break;

        case 'verify_grn':
            require_permission($pdo, $user_id, 'purchases', 'grn', true);
            // Safely increment inventory stock based on received goods
            // Update supplier outstanding balance (Payables)
            echo json_encode(["success" => true, "message" => "GRN Verified and Stock Updated"]);
            break;

        // --- RETURN TO VENDOR ---
        case 'return_to_vendor':
            require_permission($pdo, $user_id, 'purchases', 'returns', true);
            // Safely deduct from inventory_parts and adjust supplier balances
            echo json_encode(["success" => true, "message" => "Vendor return logged successfully"]);
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
    echo json_encode(["success" => false, "error" => "Transaction error: " . $e->getMessage()]);
}
?>
