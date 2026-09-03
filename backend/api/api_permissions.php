<?php
require_once '../config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
}

try {
    switch ($action) {
        case 'get_my_permissions':
            $user_id = get_user_id_from_token();
            if (!$user_id) {
                http_response_code(401);
                echo json_encode(["error" => "Unauthorized"]);
                exit();
            }
            
            $stmt = $pdo->prepare("SELECT module_name, sub_module_name, can_view, can_edit FROM user_permissions WHERE user_id = ?");
            $stmt->execute([$user_id]);
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case 'get_user_permissions':
            // Admin only check should go here in a real app
            $target_user_id = $_GET['user_id'] ?? 0;
            $stmt = $pdo->prepare("SELECT module_name, sub_module_name, can_view, can_edit FROM user_permissions WHERE user_id = ?");
            $stmt->execute([$target_user_id]);
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case 'update_permissions':
            // Admin only check should go here
            $target_user_id = $input['user_id'] ?? 0;
            $permissions = $input['permissions'] ?? [];
            
            $pdo->beginTransaction();
            // Clear existing
            $stmt = $pdo->prepare("DELETE FROM user_permissions WHERE user_id = ?");
            $stmt->execute([$target_user_id]);
            
            if (!empty($permissions)) {
                $insertStmt = $pdo->prepare("INSERT INTO user_permissions (user_id, module_name, sub_module_name, can_view, can_edit) VALUES (?, ?, ?, ?, ?)");
                foreach ($permissions as $p) {
                    $insertStmt->execute([
                        $target_user_id,
                        $p['module_name'],
                        $p['sub_module_name'],
                        $p['can_view'] ? 1 : 0,
                        $p['can_edit'] ? 1 : 0
                    ]);
                }
            }
            $pdo->commit();
            echo json_encode(["success" => true, "message" => "Permissions updated successfully"]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Invalid action specified."]);
            break;
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
