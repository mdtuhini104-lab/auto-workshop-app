<?php
// Secure CORS implementation
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
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

// Database configuration
$host = '127.0.0.1';
$db   = 'auto_workshop';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Log error securely in production instead of displaying it
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed."]);
    exit();
}

// JWT Secret Key - In production, use environment variables
define('JWT_SECRET', 'super_secret_jwt_key_for_auto_workshop_app');

// Helper function to encode base64url (used for JWT)
function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

// Helper function to extract user_id from JWT securely
function get_user_id_from_token(): ?int {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (empty($authHeader) && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? '';
    }
    
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $jwt = $matches[1];
        $parts = explode('.', $jwt);
        if (count($parts) === 3) {
            $header = $parts[0];
            $payload = $parts[1];
            $signature = $parts[2];
            
            $valid_signature = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)), '+/', '-_'), '=');
            
            if (hash_equals($valid_signature, $signature)) {
                $decoded_payload = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
                if (isset($decoded_payload['exp']) && $decoded_payload['exp'] >= time()) {
                    return $decoded_payload['user_id'] ?? null;
                }
            }
        }
    }
    return null;
}

// Wrapper to check permissions
function check_permission(PDO $pdo, ?int $user_id, string $module, string $sub_module, bool $requires_edit = false): bool {
    if (!$user_id) return false;
    
    // Check if user is Super Admin
    $stmtRole = $pdo->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $stmtRole->execute([$user_id]);
    $userRole = $stmtRole->fetchColumn();
    if ($userRole === 'Super Admin' || $userRole === 'Admin') return true;
    
    $stmt = $pdo->prepare("SELECT can_view, can_edit FROM user_permissions WHERE user_id = ? AND module_name = ? AND sub_module_name = ? LIMIT 1");
    $stmt->execute([$user_id, $module, $sub_module]);
    $perms = $stmt->fetch();
    
    if (!$perms) return false;
    
    if ($requires_edit) {
        return (bool)$perms['can_edit'];
    }
    return (bool)$perms['can_view'];
}

function require_permission(PDO $pdo, ?int $user_id, string $module, string $sub_module, bool $requires_edit = false): void {
    if (!check_permission($pdo, $user_id, $module, $sub_module, $requires_edit)) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Insufficient permissions for $module / $sub_module"]);
        exit();
    }
}
?>
