<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config.php';

$action = $_GET['action'] ?? '';

if ($action === 'save_quotation' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        echo json_encode(["success" => false, "message" => "Invalid JSON payload."]);
        exit;
    }
    
    $customer_id = $data['customer_id'] ?? null;
    $vehicle_id = $data['vehicle_id'] ?? null;
    $quotation_date = $data['quotation_date'] ?? null;
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
        echo json_encode(["success" => false, "message" => "Missing required fields: Customer, Vehicle, or Line Items."]);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // Ensure table exists for safety, though user assumed it
        $pdo->exec("CREATE TABLE IF NOT EXISTS quotations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            quotation_no VARCHAR(50) UNIQUE,
            customer_id INT,
            vehicle_id INT,
            quotation_date DATE,
            valid_until DATE,
            status VARCHAR(50),
            subtotal DECIMAL(10,2),
            discount_type VARCHAR(20),
            discount_value DECIMAL(10,2),
            tax_percent DECIMAL(5,2),
            grand_total DECIMAL(10,2),
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        $pdo->exec("CREATE TABLE IF NOT EXISTS quotation_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            quotation_id INT,
            item_id VARCHAR(50),
            name VARCHAR(255),
            type VARCHAR(50),
            unit_price DECIMAL(10,2),
            qty INT,
            total DECIMAL(10,2),
            FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
        )");

        // Generate Quotation No
        $stmt = $pdo->query("SELECT COUNT(*) FROM quotations");
        $count = $stmt->fetchColumn() + 1;
        $quotation_no = 'QT-' . date('Y') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
        
        // Insert Master Record
        $stmt = $pdo->prepare("INSERT INTO quotations (quotation_no, customer_id, vehicle_id, quotation_date, valid_until, status, subtotal, discount_type, discount_value, tax_percent, grand_total, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $quotation_no, $customer_id, $vehicle_id, $quotation_date, $valid_until, $status,
            $subtotal, $discount_type, $discount_value, $tax_percent, $grand_total, $notes
        ]);
        
        $quotation_id = $pdo->lastInsertId();
        
        // Insert Line Items
        $stmt_item = $pdo->prepare("INSERT INTO quotation_items (quotation_id, item_id, name, type, unit_price, qty, total) VALUES (?, ?, ?, ?, ?, ?, ?)");
        
        foreach ($line_items as $item) {
            $stmt_item->execute([
                $quotation_id,
                $item['item_id'],
                $item['name'],
                $item['type'],
                $item['unit_price'],
                $item['qty'],
                $item['total']
            ]);
        }
        
        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Quotation saved successfully", "quotation_id" => $quotation_id, "quotation_no" => $quotation_no]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid action or method."]);
}
?>
