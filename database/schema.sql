-- phpMyAdmin SQL Dump or basic SQL script
-- Database: auto_workshop

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table users
--
CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(50) NOT NULL,
  password_hash varchar(255) NOT NULL,
  role enum('Admin','Manager','Mechanic') NOT NULL DEFAULT 'Mechanic',
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table customers
--
CREATE TABLE customers (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  phone varchar(20) NOT NULL,
  email varchar(100) DEFAULT NULL,
  address text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table vehicles
--
CREATE TABLE vehicles (
  id int(11) NOT NULL AUTO_INCREMENT,
  customer_id int(11) NOT NULL,
  make varchar(50) NOT NULL,
  model varchar(50) NOT NULL,
  year int(4) NOT NULL,
  license_plate varchar(20) NOT NULL,
  chassis_number varchar(50) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY license_plate (license_plate),
  UNIQUE KEY chassis_number (chassis_number),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table inventory_parts
--
CREATE TABLE inventory_parts (
  id int(11) NOT NULL AUTO_INCREMENT,
  part_name varchar(100) NOT NULL,
  part_number varchar(50) NOT NULL,
  stock_quantity int(11) NOT NULL DEFAULT 0,
  price decimal(10,2) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY part_number (part_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table vehicle_intake
--
CREATE TABLE vehicle_intake (
  id int(11) NOT NULL AUTO_INCREMENT,
  vehicle_id int(11) NOT NULL,
  intake_date datetime DEFAULT CURRENT_TIMESTAMP,
  driver_complaints text NOT NULL,
  status enum('Pending Inspection','Inspected','Quoted','Approved','In Progress','Completed') DEFAULT 'Pending Inspection',
  PRIMARY KEY (id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table inspections
--
CREATE TABLE inspections (
  id int(11) NOT NULL AUTO_INCREMENT,
  intake_id int(11) NOT NULL,
  mechanic_id int(11) NOT NULL,
  inspection_date datetime DEFAULT CURRENT_TIMESTAMP,
  findings text,
  PRIMARY KEY (id),
  FOREIGN KEY (intake_id) REFERENCES vehicle_intake(id) ON DELETE CASCADE,
  FOREIGN KEY (mechanic_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table inspection_items
--
CREATE TABLE inspection_items (
  id int(11) NOT NULL AUTO_INCREMENT,
  inspection_id int(11) NOT NULL,
  part_id int(11) DEFAULT NULL, -- Nullable if it's just a service
  description varchar(255) NOT NULL, -- Description of service or part
  part_source enum('Inventory','Customer') DEFAULT 'Inventory',
  quantity int(11) NOT NULL DEFAULT 1,
  service_charge decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id),
  FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE,
  FOREIGN KEY (part_id) REFERENCES inventory_parts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table quotations
--
CREATE TABLE quotations (
  id int(11) NOT NULL AUTO_INCREMENT,
  intake_id int(11) NOT NULL,
  total_parts_cost decimal(10,2) NOT NULL DEFAULT 0.00,
  total_service_charge decimal(10,2) NOT NULL DEFAULT 0.00,
  grand_total decimal(10,2) NOT NULL DEFAULT 0.00,
  status enum('Draft','Sent','Approved','Rejected') DEFAULT 'Draft',
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (intake_id) REFERENCES vehicle_intake(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table work_orders
--
CREATE TABLE work_orders (
  id int(11) NOT NULL AUTO_INCREMENT,
  quotation_id int(11) NOT NULL,
  status enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  start_date datetime DEFAULT CURRENT_TIMESTAMP,
  completion_date datetime DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table job_cards
--
CREATE TABLE job_cards (
  id int(11) NOT NULL AUTO_INCREMENT,
  work_order_id int(11) NOT NULL,
  mechanic_id int(11) NOT NULL,
  task_description text NOT NULL,
  status enum('Assigned','In Progress','Done') DEFAULT 'Assigned',
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (mechanic_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table invoices
--
CREATE TABLE invoices (
  id int(11) NOT NULL AUTO_INCREMENT,
  work_order_id int(11) NOT NULL,
  amount_due decimal(10,2) NOT NULL,
  status enum('Unpaid','Paid') DEFAULT 'Unpaid',
  issued_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



COMMIT;
