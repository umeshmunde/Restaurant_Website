-- ============================================
-- MySQL Workbench Setup Script for Restaurant Website
-- Copy and paste this entire script into MySQL Workbench
-- ============================================

-- Create the database
CREATE DATABASE IF NOT EXISTS restaurant_db;

-- Use the database
USE restaurant_db;

-- ============================================
-- BOOKINGS TABLE
-- Stores table reservation information
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email_address VARCHAR(255) NOT NULL,
  total_person INT NOT NULL,
  booking_date DATETIME NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ORDERS TABLE
-- Stores food order information
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Verify tables were created
-- ============================================
SHOW TABLES;

-- ============================================
-- View table structures (optional - to verify)
-- ============================================
DESCRIBE bookings;
DESCRIBE orders;

-- ============================================
-- Sample queries to test (optional)
-- ============================================

-- View all bookings
-- SELECT * FROM bookings ORDER BY created_at DESC;

-- View all orders
-- SELECT * FROM orders ORDER BY created_at DESC;

-- Count total bookings
-- SELECT COUNT(*) AS total_bookings FROM bookings;

-- Count total orders
-- SELECT COUNT(*) AS total_orders FROM orders;

