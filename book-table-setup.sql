-- ============================================
-- MySQL Workbench Setup for BOOK TABLE System
-- Copy and paste this into MySQL Workbench
-- ============================================

-- Create the database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS restaurant_db;

-- Use the database
USE restaurant_db;

-- ============================================
-- BOOKINGS TABLE - For Table Reservations
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
-- Verify the table was created
-- ============================================
SHOW TABLES;

-- View the table structure
DESCRIBE bookings;

-- ============================================
-- Sample Test Queries for Book Table
-- ============================================

-- View all table bookings
-- SELECT * FROM bookings ORDER BY created_at DESC;

-- View bookings for today
-- SELECT * FROM bookings WHERE DATE(booking_date) = CURDATE();

-- View upcoming bookings
-- SELECT * FROM bookings WHERE booking_date >= NOW() ORDER BY booking_date ASC;

-- Count total bookings
-- SELECT COUNT(*) AS total_bookings FROM bookings;

-- View bookings by customer name
-- SELECT * FROM bookings WHERE full_name LIKE '%John%';

-- Delete all bookings (use with caution!)
-- DELETE FROM bookings;

-- ============================================
-- Sample Test Data (Optional - for testing)
-- ============================================
-- Uncomment the lines below to insert test data

/*
INSERT INTO bookings (full_name, email_address, total_person, booking_date, message) 
VALUES 
('John Doe', 'john@example.com', 2, '2024-12-01 19:00:00', 'Dinner reservation for 2 people'),
('Jane Smith', 'jane@example.com', 4, '2024-12-02 20:00:00', 'Family dinner'),
('Mike Johnson', 'mike@example.com', 1, '2024-12-03 18:30:00', 'Solo dinner');
*/

