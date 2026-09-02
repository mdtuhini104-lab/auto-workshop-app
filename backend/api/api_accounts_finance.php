<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
}

$user_id = get_user_id_from_token();

try {
    switch ($action) {
        // --- ACCOUNTS & FINANCE ---
        case 'get_chart_of_accounts':
            require_permission($pdo, $user_id, 'accounts', 'chart-of-accounts', false);
            echo json_encode(["success" => true, "data" => []]);
            break;

        case 'get_cash_bank_balances':
            require_permission($pdo, $user_id, 'accounts', 'cash-bank', false);
            echo json_encode(["success" => true, "data" => []]);
            break;

        case 'get_receivables':
            require_permission($pdo, $user_id, 'accounts', 'receivables', false);
            $stmt = $pdo->query("
                SELECT c.id, c.name, c.phone, 
                COALESCE(SUM(CASE WHEN cl.transaction_type = 'Debit' THEN cl.amount ELSE -cl.amount END), 0) as total_due
                FROM customers c
                LEFT JOIN customer_ledger cl ON c.id = cl.customer_id
                GROUP BY c.id
                HAVING total_due > 0
            ");
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        // --- PEOPLES DIRECTORY ---
        case 'get_users':
            require_permission($pdo, $user_id, 'peoples', 'users', false);
            $stmt = $pdo->query("SELECT id, username, role FROM users");
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        case 'get_employees':
            require_permission($pdo, $user_id, 'peoples', 'employees', false);
            // Mechanics & Staff Ledger
            $stmt = $pdo->query("SELECT id, username as name, role FROM users WHERE role = 'Mechanic'");
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        // --- EXPENSES ---
        case 'log_expense':
            require_permission($pdo, $user_id, 'accounts', 'expenses', true);
            $category = $input['category'];
            $amount = $input['amount'];
            $employee_id = $input['employee_id'] ?? null;
            $description = $input['description'] ?? '';

            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO expenses (category, amount, employee_id, description) VALUES (?, ?, ?, ?)");
            $stmt->execute([$category, $amount, $employee_id, $description]);
            $pdo->commit();
            
            echo json_encode(["success" => true, "message" => "Expense logged successfully"]);
            break;

        case 'get_expenses':
            require_permission($pdo, $user_id, 'accounts', 'expenses', false);
            $stmt = $pdo->query("SELECT e.*, u.username as employee_name FROM expenses e LEFT JOIN users u ON e.employee_id = u.id ORDER BY e.created_at DESC");
            echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Invalid action specified."]);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
