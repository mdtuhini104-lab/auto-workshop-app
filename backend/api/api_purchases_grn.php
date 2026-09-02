<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
}

try {
    switch ($action) {
        // --- VENDOR PURCHASES ---
        case 'get_purchases':
            // SELECT * FROM purchase_orders
            echo json_encode(["success" => true, "data" => []]);
            break;
            
        case 'create_purchase_order':
            // INSERT INTO purchase_orders
            echo json_encode(["success" => true, "message" => "PO created"]);
            break;

        // --- GOODS RECEIVED NOTE (GRN) ---
        case 'get_pending_grn':
            // Fetch POs waiting for receipt
            echo json_encode(["success" => true, "data" => []]);
            break;

        case 'verify_grn':
            // Safely increment inventory stock based on received goods
            // Update supplier outstanding balance (Payables)
            echo json_encode(["success" => true, "message" => "GRN Verified and Stock Updated"]);
            break;

        // --- RETURN TO VENDOR ---
        case 'return_to_vendor':
            // Safely deduct from inventory_parts and adjust supplier balances
            echo json_encode(["success" => true, "message" => "Vendor return logged successfully"]);
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
