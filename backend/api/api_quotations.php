<?php
require_once '../config.php';
header('Content-Type: application/json');

$user_id = get_user_id_from_token();
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit();
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'get_quotations' && $method === 'GET') {
    require_permission($pdo, $user_id, 'quotations', 'quotations', false);

    try {
        $stmt = $pdo->query("
            SELECT q.*, c.name AS customer_name, c.phone AS customer_phone, v.plate_number, v.brand, v.model
            FROM quotations q
            LEFT JOIN customers c ON q.customer_id = c.id
            LEFT JOIN vehicles v ON q.vehicle_id = v.id
            ORDER BY q.id DESC
        ");
        $quotations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $quotations]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
    }
} elseif ($action === 'save_quotation' && $method === 'POST') {
    require_permission($pdo, $user_id, 'quotations', 'quotations', true);

    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON payload."]);
        exit;
    }
    
    $customer_id = $data['customer_id'] ?? null;
    $vehicle_id = $data['vehicle_id'] ?? null;
    $quotation_date = $data['quotation_date'] ?? date('Y-m-d');
    $valid_until = $data['valid_until'] ?? null;
    $status = $data['status'] ?? 'Draft';
    $subtotal = $data['subtotal'] ?? 0;
    $discount_type = $data['discount_type'] ?? 'percent';
    $discount_value = $data['discount_value'] ?? 0;
    $tax_percent = $data['tax_percent'] ?? 0;
    $grand_total = $data['grand_total'] ?? 0;
    $notes = $data['notes'] ?? '';
    $line_items = $data['line_items'] ?? [];
    
    if (!$customer_id || !$vehicle_id || empty($line_items)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required fields: Customer, Vehicle, or Line Items."]);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // Generate Quotation No
        $stmt = $pdo->query("SELECT COUNT(*) FROM quotations");
        $count = $stmt->fetchColumn() + 1;
        $quotation_no = 'QT-' . date('Y') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
        
        // Resolve active ownership_id for vehicle if not explicitly supplied
        $ownership_id = !empty($data['ownership_id']) ? intval($data['ownership_id']) : null;
        if (!$ownership_id && $vehicle_id) {
            $voh_stmt = $pdo->prepare("SELECT id FROM vehicle_ownership_history WHERE vehicle_id = ? AND ownership_status = 'Active' ORDER BY id DESC LIMIT 1");
            $voh_stmt->execute([$vehicle_id]);
            $ownership_id = $voh_stmt->fetchColumn() ?: null;
        }

        // Insert Master Record (checking if ownership_id column exists or safe fallback)
        try {
            $stmt = $pdo->prepare("INSERT INTO quotations (quotation_no, customer_id, vehicle_id, ownership_id, quotation_date, valid_until, status, subtotal, discount_type, discount_value, tax_percent, grand_total, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $quotation_no, $customer_id, $vehicle_id, $ownership_id, $quotation_date, $valid_until, $status,
                $subtotal, $discount_type, $discount_value, $tax_percent, $grand_total, $notes
            ]);
        } catch (Exception $colEx) {
            $stmt = $pdo->prepare("INSERT INTO quotations (quotation_no, customer_id, vehicle_id, quotation_date, valid_until, status, subtotal, discount_type, discount_value, tax_percent, grand_total, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $quotation_no, $customer_id, $vehicle_id, $quotation_date, $valid_until, $status,
                $subtotal, $discount_type, $discount_value, $tax_percent, $grand_total, $notes
            ]);
        }
        
        $quotation_id = $pdo->lastInsertId();
        
        // Insert Line Items
        $stmt_item = $pdo->prepare("INSERT INTO quotation_items (quotation_id, item_id, name, type, unit_price, qty, total) VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        foreach ($line_items as $item) {
            $stmt_item->execute([
                $quotation_id,
                $item['item_id'] ?? null,
                $item['name'] ?? '',
                $item['type'] ?? 'item',
                $item['unit_price'] ?? 0,
                $item['qty'] ?? 1,
                $item['total'] ?? 0
            ]);
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Quotation saved successfully", "quotation_id" => $quotation_id, "quotation_no" => $quotation_no]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid action or method."]);
}
?>
