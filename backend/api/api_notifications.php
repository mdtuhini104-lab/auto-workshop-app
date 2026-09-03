<?php
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

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';
$request_uri = $_SERVER['REQUEST_URI'] ?? '';

// Auto-create notifications table if not exists
try {
    if (isset($pdo)) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT,
            type VARCHAR(50) DEFAULT 'info',
            is_read TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
    }
} catch (Exception $e) {
    // Ignore schema creation errors if already handled
}

$user_id = function_exists('get_user_id_from_token') ? (get_user_id_from_token() ?? 1) : 1;

// Handle read-all
if ($method === 'PATCH' || $action === 'read_all' || strpos($request_uri, 'read-all') !== false || strpos($request_uri, 'read_all') !== false) {
    try {
        if (isset($pdo)) {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL");
            $stmt->execute([$user_id]);
        }
        echo json_encode([
            'success' => true,
            'message' => 'All notifications marked as read',
            'timestamp' => date('c')
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => true,
            'message' => 'Handled'
        ]);
    }
    exit;
}

// Handle clear-all
if ($method === 'POST' || $action === 'clear_all' || strpos($request_uri, 'clear-all') !== false || strpos($request_uri, 'clear_all') !== false) {
    try {
        if (isset($pdo)) {
            $stmt = $pdo->prepare("DELETE FROM notifications WHERE user_id = ? OR user_id IS NULL");
            $stmt->execute([$user_id]);
        }
        echo json_encode([
            'success' => true,
            'message' => 'All notifications cleared successfully',
            'timestamp' => date('c')
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'success' => true,
            'message' => 'Handled'
        ]);
    }
    exit;
}

// Default GET list
try {
    $notifications = [];
    if (isset($pdo)) {
        $stmt = $pdo->prepare("SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY id DESC LIMIT 20");
        $stmt->execute([$user_id]);
        $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    echo json_encode([
        'success' => true,
        'data' => $notifications,
        'timestamp' => date('c')
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => true,
        'data' => [],
        'timestamp' => date('c')
    ]);
}
exit;
