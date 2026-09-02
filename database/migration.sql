CREATE TABLE IF NOT EXISTS suppliers (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  contact_info varchar(255),
  balance decimal(10,2) NOT NULL DEFAULT 0.00,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE inventory_parts ADD COLUMN supplier_id int(11) DEFAULT NULL;
ALTER TABLE inventory_parts ADD COLUMN low_stock_threshold int(11) NOT NULL DEFAULT 5;
ALTER TABLE inventory_parts ADD FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS pos_invoices (
  id int(11) NOT NULL AUTO_INCREMENT,
  customer_name varchar(100) DEFAULT 'Walk-in Customer',
  grand_total decimal(10,2) NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pos_invoice_items (
  id int(11) NOT NULL AUTO_INCREMENT,
  pos_invoice_id int(11) NOT NULL,
  part_id int(11) NOT NULL,
  quantity int(11) NOT NULL,
  price decimal(10,2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (pos_invoice_id) REFERENCES pos_invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (part_id) REFERENCES inventory_parts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
