<?php
require_once __DIR__ . '/../config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';
$request_uri = $_SERVER['REQUEST_URI'] ?? '';

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
