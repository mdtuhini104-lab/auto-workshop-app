<?php
require_once 'config.php';

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS user_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        module_name VARCHAR(100) NOT NULL,
        sub_module_name VARCHAR(100) NOT NULL,
        can_view TINYINT(1) DEFAULT 0,
        can_edit TINYINT(1) DEFAULT 0,
        UNIQUE KEY unique_permission (user_id, module_name, sub_module_name)
    )");
    $pdo->exec("DROP TABLE IF EXISTS item_categories");
    $pdo->exec("CREATE TABLE item_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        category_code VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        photo_url VARCHAR(255),
        status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NULL
    )");

    $pdo->exec("DROP TABLE IF EXISTS measurement_units");
    $pdo->exec("CREATE TABLE measurement_units (
        id INT AUTO_INCREMENT PRIMARY KEY,
        unit_name VARCHAR(255) NOT NULL,
        symbol VARCHAR(50) NOT NULL UNIQUE,
        details TEXT,
        status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NULL
    )");

    $pdo->exec("DROP TABLE IF EXISTS workshops");
    $pdo->exec("CREATE TABLE workshops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        workshop_name VARCHAR(255) NOT NULL,
        city VARCHAR(255),
        location_address TEXT,
        state VARCHAR(255),
        zip_code VARCHAR(50),
        country VARCHAR(255),
        status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NULL
    )");

    $pdo->exec("DROP TABLE IF EXISTS departments");
    $pdo->exec("CREATE TABLE departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        department_name VARCHAR(255) NOT NULL,
        department_code VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NULL
    )");

    $pdo->exec("DROP TABLE IF EXISTS services");
    $pdo->exec("CREATE TABLE services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_name VARCHAR(255) NOT NULL,
        service_code VARCHAR(50) NULL,
        core_category_type ENUM('Water Service', 'Repair & Maintenance', 'Denting & Painting', 'AC Service') NOT NULL,
        base_labor_charge DECIMAL(10, 2) NOT NULL,
        estimated_duration VARCHAR(100),
        status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NULL
    )");

    $pdo->exec("DROP TABLE IF EXISTS items");
    $pdo->exec("CREATE TABLE items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_name VARCHAR(255) NOT NULL,
        item_code VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        unit_id INT,
        purchase_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        categories JSON,
        gallery_images JSON,
        status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NULL
    )");

    $pdo->exec("DROP TABLE IF EXISTS customers");
    $pdo->exec("CREATE TABLE customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NULL
    )");

    $pdo->exec("DROP TABLE IF EXISTS vehicles");
    $pdo->exec("CREATE TABLE vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plate_number VARCHAR(100) NOT NULL UNIQUE,
        customer_id INT NULL,
        brand VARCHAR(100),
        model VARCHAR(100),
        year INT,
        engine_number VARCHAR(100),
        chassis_number VARCHAR(100),
        driver_name VARCHAR(255),
        driver_number VARCHAR(50),
        color VARCHAR(50),
        status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NULL
    )");

    $pdo->exec("DROP TABLE IF EXISTS inspections");
    $pdo->exec("CREATE TABLE inspections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        vehicle_id INT NOT NULL,
        mechanic_id INT NULL,
        customer_requirement TEXT,
        mechanic_report TEXT,
        status ENUM('Open', 'Under Review', 'Converted', 'Closed') DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by INT NULL
    )");

    $pdo->exec("DROP TABLE IF EXISTS inspection_problems");
    $pdo->exec("CREATE TABLE inspection_problems (
        id INT AUTO_INCREMENT PRIMARY KEY,
        inspection_id INT NOT NULL,
        problem_title VARCHAR(255) NOT NULL,
        description TEXT,
        severity VARCHAR(50),
        suggested_service_id INT NULL,
        est_cost DECIMAL(10, 2) DEFAULT 0.00
    )");

    $pdo->exec("DROP TABLE IF EXISTS inspection_items");
    $pdo->exec("CREATE TABLE inspection_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        inspection_id INT NOT NULL,
        item_id INT NOT NULL,
        quantity INT DEFAULT 1
    )");

    echo "Database setup successful.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
