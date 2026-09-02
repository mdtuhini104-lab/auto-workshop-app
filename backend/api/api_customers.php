<?php
// Dynamic CORS - reflects requesting origin, supports credentials & preflight
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}
require_once '../config.php';
header('Content-Type: application/json');
$action = $_GET['action'] ?? '';

if ($action === 'get_customers') {
    try {
        $pdo->exec("ALTER TABLE customers ADD COLUMN customer_code VARCHAR(20) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN company VARCHAR(100) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN city VARCHAR(50) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN state VARCHAR(50) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN zip_code VARCHAR(20) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN country VARCHAR(50) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN status VARCHAR(20) DEFAULT 'Active'");
    } catch (Exception $e) { }

    try {
        $stmt = $pdo->query("
            SELECT 
                c.id, 
                c.customer_code, 
                c.name, 
                c.email, 
                c.phone, 
                c.company, 
                c.status, 
                c.created_at,
                COUNT(v.id) AS vehicle_count
            FROM customers c
            LEFT JOIN vehicles v ON c.id = v.customer_id
            GROUP BY c.id
            ORDER BY c.id DESC
        ");
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $customers]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
} elseif ($action === 'save_customer') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $company = $data['company'] ?? '';
    $address = $data['address'] ?? '';
    $city = $data['city'] ?? '';
    $state = $data['state'] ?? '';
    $zip = $data['zip'] ?? '';
    $country = $data['country'] ?? '';
    $status = $data['status'] ?? 'Active';

    if (empty($name) || empty($phone)) {
        echo json_encode(['success' => false, 'error' => 'Name and Phone are required fields']);
        exit;
    }

    try {
        $pdo->exec("ALTER TABLE customers ADD COLUMN customer_code VARCHAR(20) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN company VARCHAR(100) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN city VARCHAR(50) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN state VARCHAR(50) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN zip_code VARCHAR(20) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN country VARCHAR(50) NULL");
        $pdo->exec("ALTER TABLE customers ADD COLUMN status VARCHAR(20) DEFAULT 'Active'");
    } catch (Exception $e) { }

    try {
        $pdo->beginTransaction();
        
        // Generate customer code
        $countStmt = $pdo->query("SELECT COUNT(*) FROM customers");
        $count = $countStmt->fetchColumn() + 1;
        $customerCode = 'CUS' . str_pad($count, 7, '0', STR_PAD_LEFT);

        $stmt = $pdo->prepare("
            INSERT INTO customers (customer_code, name, email, phone, company, address, city, state, zip_code, country, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$customerCode, $name, $email, $phone, $company, $address, $city, $state, $zip, $country, $status]);
        
        $customerId = $pdo->lastInsertId();
        $pdo->commit();
        
        echo json_encode(['success' => true, 'message' => 'Customer created successfully', 'customer_id' => $customerId]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'Failed to save customer: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid action']);
}
?>
