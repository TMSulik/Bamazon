DROP DATABASE IF EXISTS inventory;
CREATE DATABASE inventory;
USE inventory;

CREATE TABLE products (
  item_id INTEGER NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(40) NULL,
  price DECIMAL(10,3) NULL,
  stock_quantity INTEGER(10) NULL,
  PRIMARY KEY(item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES
(1001, "Edible Batteries", "Grocery", 16.95, 22),
(1007, "Tide PODS® Candy", "Grocery", 2.95, 3000),
(2012, "Sonic Grenade", "Munitions", 23.95, 430),
(3213, "Pavlok", "Medical Supplies", 50.00, 222),
(4004, "Selfie Toaster", "Kitchenware", 125.95, 300),
(5015, "Smart Toothpick", "Self Care", 30.00, 1000),
(3216, "EEG Headband", "Medical Supplies", 400.00, 6),
(6027, "Gold Plated Bitcoin", "Personal Finance", 3822.55, 10),
(7008, "Electric Chastity Belt", "Home Entertainment", 75.95, 23),
(3219, "Colonoscopy Bot", "Medical Supplies", 444.00, 12),(7010, "Mechanical Turk", "Home Entertainment", 5000.00, 0); 

SELECT * FROM inventory.products LIMIT 200;
