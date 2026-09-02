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
$user_id = get_user_id_from_token();

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($action) {
        // --- CATEGORIES ---
        case 'get_categories':
            require_permission($pdo, $user_id, 'masterData', 'categories', false);
            $search = $_GET['search'] ?? '';
            if ($search) {
                $stmt = $pdo->prepare("SELECT * FROM item_categories WHERE category_name LIKE ? OR description LIKE ? ORDER BY id DESC");
                $stmt->execute(["%$search%", "%$search%"]);
            } else {
                $stmt = $pdo->query("SELECT * FROM item_categories ORDER BY id DESC");
            }
            echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
            break;

        case 'save_category':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'masterData', 'categories', true);
            $data = json_decode(file_get_contents("php://input"));
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO item_categories (category_name, category_code, description, photo_url, status, created_by) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE category_name = VALUES(category_name), description = VALUES(description), photo_url = VALUES(photo_url), status = VALUES(status)");
            $stmt->execute([$data->category_name, $data->category_code ?? uniqid('CAT-'), $data->description ?? '', $data->photo_url ?? '', $data->status ?? 'Active', $user_id]);
            $pdo->commit();
            
            echo json_encode(["success" => true, "message" => "Category saved successfully"]);
            break;

        // --- UNITS ---
        case 'get_units':
            require_permission($pdo, $user_id, 'masterData', 'units', false);
            $search = $_GET['search'] ?? '';
            if ($search) {
                $stmt = $pdo->prepare("SELECT * FROM measurement_units WHERE unit_name LIKE ? OR symbol LIKE ? ORDER BY id DESC");
                $stmt->execute(["%$search%", "%$search%"]);
            } else {
                $stmt = $pdo->query("SELECT * FROM measurement_units ORDER BY id DESC");
            }
            echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
            break;

        case 'save_unit':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'masterData', 'units', true);
            $data = json_decode(file_get_contents("php://input"));
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO measurement_units (unit_name, symbol, details, status, created_by) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE unit_name = VALUES(unit_name), details = VALUES(details), status = VALUES(status)");
            $stmt->execute([$data->unit_name, $data->symbol, $data->details ?? '', $data->status ?? 'Active', $user_id]);
            $pdo->commit();
            
            echo json_encode(["success" => true, "message" => "Unit saved successfully"]);
            break;

        // --- WORKSHOPS ---
        case 'get_workshops':
            require_permission($pdo, $user_id, 'masterData', 'workshops', false);
            $search = $_GET['search'] ?? '';
            if ($search) {
                $stmt = $pdo->prepare("SELECT * FROM workshops WHERE workshop_name LIKE ? OR location_address LIKE ? OR city LIKE ? ORDER BY id DESC");
                $stmt->execute(["%$search%", "%$search%", "%$search%"]);
            } else {
                $stmt = $pdo->query("SELECT * FROM workshops ORDER BY id DESC");
            }
            echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
            break;

        case 'save_workshop':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'masterData', 'workshops', true);
            $data = json_decode(file_get_contents("php://input"));
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO workshops (workshop_name, city, location_address, state, zip_code, country, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$data->workshop_name, $data->city ?? '', $data->location_address ?? '', $data->state ?? '', $data->zip_code ?? '', $data->country ?? '', $data->status ?? 'Active', $user_id]);
            $pdo->commit();
            
            echo json_encode(["success" => true, "message" => "Workshop saved successfully"]);
            break;

        // --- DEPARTMENTS ---
        case 'get_departments':
            require_permission($pdo, $user_id, 'masterData', 'departments', false);
            $search = $_GET['search'] ?? '';
            if ($search) {
                $stmt = $pdo->prepare("SELECT * FROM departments WHERE department_name LIKE ? OR department_code LIKE ? ORDER BY id DESC");
                $stmt->execute(["%$search%", "%$search%"]);
            } else {
                $stmt = $pdo->query("SELECT * FROM departments ORDER BY id DESC");
            }
            echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
            break;

        case 'save_department':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'masterData', 'departments', true);
            $data = json_decode(file_get_contents("php://input"));
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO departments (department_name, department_code, description, status, created_by) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE department_name = VALUES(department_name), description = VALUES(description), status = VALUES(status)");
            $stmt->execute([$data->department_name, $data->department_code ?? uniqid('DEP-'), $data->description ?? '', $data->status ?? 'Active', $user_id]);
            $pdo->commit();
            
            echo json_encode(["success" => true, "message" => "Department saved successfully"]);
            break;

        // --- SERVICES ---
        case 'get_services':
            require_permission($pdo, $user_id, 'masterData', 'services', false);
            $search = $_GET['search'] ?? '';
            if ($search) {
                $stmt = $pdo->prepare("SELECT * FROM services WHERE service_name LIKE ? OR core_category_type LIKE ? ORDER BY id DESC");
                $stmt->execute(["%$search%", "%$search%"]);
            } else {
                $stmt = $pdo->query("SELECT * FROM services ORDER BY id DESC");
            }
            echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
            break;

        case 'save_service':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'masterData', 'services', true);
            $data = json_decode(file_get_contents("php://input"));
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO services (service_name, service_code, core_category_type, base_labor_charge, estimated_duration, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$data->service_name, $data->service_code ?? uniqid('SRV-'), $data->core_category_type, $data->base_labor_charge, $data->estimated_duration ?? '', $data->status ?? 'Active', $user_id]);
            $pdo->commit();
            
            echo json_encode(["success" => true, "message" => "Service saved successfully"]);
            break;

        // --- ITEMS ---
        case 'get_items':
            require_permission($pdo, $user_id, 'masterData', 'items', false);
            $search = $_GET['search'] ?? '';
            if ($search) {
                // In a real app we would join with units and categories, keeping it simple here
                $stmt = $pdo->prepare("SELECT * FROM items WHERE item_name LIKE ? OR item_code LIKE ? ORDER BY id DESC");
                $stmt->execute(["%$search%", "%$search%"]);
            } else {
                $stmt = $pdo->query("SELECT * FROM items ORDER BY id DESC");
            }
            echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
            break;

        case 'save_item':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'masterData', 'items', true);
            $data = json_decode(file_get_contents("php://input"));
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO items (item_name, item_code, description, unit_id, purchase_price, selling_price, categories, gallery_images, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE item_name = VALUES(item_name), description = VALUES(description), unit_id = VALUES(unit_id), purchase_price = VALUES(purchase_price), selling_price = VALUES(selling_price), categories = VALUES(categories), gallery_images = VALUES(gallery_images), status = VALUES(status)");
            
            // Encode JSON arrays
            $categories_json = isset($data->categories) ? json_encode($data->categories) : '[]';
            $gallery_json = isset($data->gallery_images) ? json_encode($data->gallery_images) : '[]';
            
            $stmt->execute([
                $data->item_name, 
                $data->item_code ?? uniqid('ITM-'), 
                $data->description ?? '', 
                $data->unit_id ?? null, 
                $data->purchase_price ?? 0, 
                $data->selling_price ?? 0, 
                $categories_json, 
                $gallery_json, 
                $data->status ?? 'Active', 
                $user_id
            ]);
            $pdo->commit();
            
            echo json_encode(["success" => true, "message" => "Item saved successfully"]);
            break;

        // --- VEHICLES ---
        case 'get_vehicles':
            require_permission($pdo, $user_id, 'masterData', 'vehicles', false);
            $search = $_GET['search'] ?? '';
            if ($search) {
                $stmt = $pdo->prepare("SELECT v.*, c.customer_name, c.phone AS customer_phone FROM vehicles v LEFT JOIN customers c ON v.customer_id = c.id WHERE v.brand LIKE ? OR v.model LIKE ? ORDER BY v.id DESC");
                $stmt->execute(["%$search%", "%$search%"]);
            } else {
                // Fetch vehicles and left join with customers
                $stmt = $pdo->query("SELECT v.*, c.customer_name, c.phone AS customer_phone FROM vehicles v LEFT JOIN customers c ON v.customer_id = c.id ORDER BY v.id DESC");
            }
            echo json_encode(["success" => true, "data" => $stmt->fetchAll()]);
            break;

        case 'save_vehicle':
            if ($method !== 'POST') throw new Exception("Invalid method");
            require_permission($pdo, $user_id, 'masterData', 'vehicles', true);
            $data = json_decode(file_get_contents("php://input"));
            
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("INSERT INTO vehicles (plate_number, customer_id, brand, model, year, engine_number, chassis_number, driver_name, driver_number, color, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE customer_id = VALUES(customer_id), brand = VALUES(brand), model = VALUES(model), year = VALUES(year), engine_number = VALUES(engine_number), chassis_number = VALUES(chassis_number), driver_name = VALUES(driver_name), driver_number = VALUES(driver_number), color = VALUES(color), status = VALUES(status)");
            $stmt->execute([
                $data->plate_number,
                $data->customer_id ?? null,
                $data->brand ?? '',
                $data->model ?? '',
                $data->year ?? date('Y'),
                $data->engine_number ?? '',
                $data->chassis_number ?? '',
                $data->driver_name ?? '',
                $data->driver_number ?? '',
                $data->color ?? '',
                $data->status ?? 'Active',
                $user_id
            ]);
            $pdo->commit();
            
            echo json_encode(["success" => true, "message" => "Vehicle saved successfully"]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Invalid action"]);
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
