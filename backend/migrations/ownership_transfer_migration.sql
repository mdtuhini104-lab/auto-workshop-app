-- 1. Vehicle Ownership History Table
CREATE TABLE IF NOT EXISTS vehicle_ownership_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    customer_id INT NOT NULL,
    ownership_start_date DATE NOT NULL,
    ownership_end_date DATE NULL,
    ownership_status ENUM('Active', 'Previous') DEFAULT 'Active',
    transfer_reason VARCHAR(255) NULL,
    transfer_reference VARCHAR(100) NULL,
    notes TEXT NULL,
    transferred_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_veh_owner (vehicle_id, customer_id, ownership_status),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Audit Trail Log for Ownership Transfers
CREATE TABLE IF NOT EXISTS vehicle_transfer_audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transfer_id VARCHAR(50) UNIQUE NOT NULL,
    vehicle_id INT NOT NULL,
    previous_owner_id INT NOT NULL,
    new_owner_id INT NOT NULL,
    transfer_date DATE NOT NULL,
    transferred_by INT NOT NULL,
    reason VARCHAR(255) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Link existing tables with ownership_id and current_owner_id
-- We add columns with existence check safeguard for re-runs
SET @dbname = DATABASE();

-- vehicles.current_owner_id
SET @precheck = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'vehicles' AND COLUMN_NAME = 'current_owner_id');
SET @sql = IF(@precheck = 0, 'ALTER TABLE vehicles ADD COLUMN current_owner_id INT NULL AFTER plate_number', 'SELECT "current_owner_id already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Backfill vehicles.current_owner_id from customer_id if NULL
UPDATE vehicles SET current_owner_id = customer_id WHERE current_owner_id IS NULL AND customer_id IS NOT NULL;

-- Backfill initial vehicle_ownership_history for existing vehicles with owners
INSERT INTO vehicle_ownership_history (vehicle_id, customer_id, ownership_start_date, ownership_status, notes)
SELECT v.id, v.customer_id, COALESCE(DATE(v.created_at), CURRENT_DATE()), 'Active', 'Initial system owner record'
FROM vehicles v
WHERE v.customer_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM vehicle_ownership_history voh WHERE voh.vehicle_id = v.id
  );

-- job_cards.ownership_id
SET @precheck_jc = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'job_cards' AND COLUMN_NAME = 'ownership_id');
SET @sql_jc = IF(@precheck_jc = 0, 'ALTER TABLE job_cards ADD COLUMN ownership_id INT NULL AFTER customer_id', 'SELECT "ownership_id in job_cards already exists"');
PREPARE stmt_jc FROM @sql_jc; EXECUTE stmt_jc; DEALLOCATE PREPARE stmt_jc;

-- invoices.ownership_id
SET @precheck_inv = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'invoices' AND COLUMN_NAME = 'ownership_id');
SET @sql_inv = IF(@precheck_inv = 0, 'ALTER TABLE invoices ADD COLUMN ownership_id INT NULL AFTER customer_id', 'SELECT "ownership_id in invoices already exists"');
PREPARE stmt_inv FROM @sql_inv; EXECUTE stmt_inv; DEALLOCATE PREPARE stmt_inv;

-- customer_ledger.ownership_id
SET @precheck_cl = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'customer_ledger' AND COLUMN_NAME = 'ownership_id');
SET @sql_cl = IF(@precheck_cl = 0, 'ALTER TABLE customer_ledger ADD COLUMN ownership_id INT NULL AFTER customer_id', 'SELECT "ownership_id in customer_ledger already exists"');
PREPARE stmt_cl FROM @sql_cl; EXECUTE stmt_cl; DEALLOCATE PREPARE stmt_cl;
