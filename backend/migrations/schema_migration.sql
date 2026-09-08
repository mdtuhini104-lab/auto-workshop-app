-- Mamun Automobiles Enterprise ERP - Schema Migration Script
-- Version: 2026.09.04
-- Standalone DDL Definitions

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. User Permissions (RBAC)
CREATE TABLE IF NOT EXISTS user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    sub_module_name VARCHAR(100) NOT NULL,
    can_view TINYINT(1) DEFAULT 0,
    can_edit TINYINT(1) DEFAULT 0,
    UNIQUE KEY unique_permission (user_id, module_name, sub_module_name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Item Categories
CREATE TABLE IF NOT EXISTS item_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    category_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    photo_url VARCHAR(255),
    status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Measurement Units
CREATE TABLE IF NOT EXISTS measurement_units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL UNIQUE,
    details TEXT,
    status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Workshops & Branches
CREATE TABLE IF NOT EXISTS workshops (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Departments
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    department_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Services
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_code VARCHAR(50) NULL,
    core_category_type ENUM('Water Service', 'Repair & Maintenance', 'Denting & Painting', 'AC Service') NOT NULL,
    base_labor_charge DECIMAL(10, 2) NOT NULL,
    estimated_duration VARCHAR(100),
    status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Items & Products
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    unit_id INT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    categories JSON NULL,
    gallery_images JSON NULL,
    status ENUM('Active', 'Inactive', 'Trash') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Customers
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(50) NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(50) NOT NULL,
    company VARCHAR(100) NULL,
    address TEXT NULL,
    city VARCHAR(50) NULL,
    state VARCHAR(50) NULL,
    zip_code VARCHAR(20) NULL,
    country VARCHAR(50) NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
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
    created_by INT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Quotations
CREATE TABLE IF NOT EXISTS quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotation_no VARCHAR(50) UNIQUE,
    customer_id INT,
    vehicle_id INT,
    quotation_date DATE,
    valid_until DATE,
    status VARCHAR(50) DEFAULT 'Draft',
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    discount_type VARCHAR(20) DEFAULT 'percent',
    discount_value DECIMAL(10,2) DEFAULT 0.00,
    tax_percent DECIMAL(5,2) DEFAULT 0.00,
    grand_total DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Quotation Line Items
CREATE TABLE IF NOT EXISTS quotation_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quotation_id INT NOT NULL,
    item_id VARCHAR(50),
    name VARCHAR(255),
    type VARCHAR(50),
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    qty INT DEFAULT 1,
    total DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Inventory Parts & Stocks
CREATE TABLE IF NOT EXISTS inventory_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100) UNIQUE,
    stock_quantity INT DEFAULT 0,
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    min_stock_level INT DEFAULT 5,
    status VARCHAR(50) DEFAULT 'Active',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE,
    vendor_id INT,
    order_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Goods Received Notes (GRN)
CREATE TABLE IF NOT EXISTS grn_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grn_number VARCHAR(50) UNIQUE,
    po_id INT,
    received_date DATE,
    status VARCHAR(50) DEFAULT 'Verified',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Customer Ledger & Receivables
CREATE TABLE IF NOT EXISTS customer_ledger (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    transaction_type ENUM('Debit', 'Credit') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    reference_no VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Inspections
CREATE TABLE IF NOT EXISTS inspections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    mechanic_id INT NULL,
    customer_requirement TEXT,
    mechanic_report TEXT,
    status ENUM('Open', 'Under Review', 'Converted', 'Closed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Inspection Problems
CREATE TABLE IF NOT EXISTS inspection_problems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inspection_id INT NOT NULL,
    problem_title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50),
    suggested_service_id INT NULL,
    est_cost DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Inspection Items
CREATE TABLE IF NOT EXISTS inspection_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inspection_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
