-- Database schema for Thana Management System
-- Execute this SQL to set up the database structure

USE thana_management;

-- Drop existing tables if they exist (be careful with this in production)
-- DROP TABLE IF EXISTS notifications;
-- DROP TABLE IF EXISTS Case_filing;
-- DROP TABLE IF EXISTS Makes_complaint;
-- DROP TABLE IF EXISTS users;

-- Enhanced users table with role-based system
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(11) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'thana-officer', 'warrant-officer') DEFAULT 'user',
    thana_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_thana_role (thana_id, role),
    FOREIGN KEY (thana_id) REFERENCES Thana(thana_id) ON DELETE SET NULL
);

-- Enhanced complaints table
ALTER TABLE Makes_complaint 
ADD COLUMN IF NOT EXISTS user_id INT,
ADD COLUMN IF NOT EXISTS crime_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS incident_date DATE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD INDEX IF NOT EXISTS idx_user_id (user_id),
ADD FOREIGN KEY IF NOT EXISTS fk_complaint_user (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Enhanced case filing table
ALTER TABLE Case_filing 
ADD COLUMN IF NOT EXISTS case_number VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS user_id INT,
ADD COLUMN IF NOT EXISTS assigned_to INT NULL,
ADD COLUMN IF NOT EXISTS progress_percentage INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS progress_notes TEXT NULL,
ADD COLUMN IF NOT EXISTS priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD INDEX IF NOT EXISTS idx_case_number (case_number),
ADD INDEX IF NOT EXISTS idx_user_id (user_id),
ADD INDEX IF NOT EXISTS idx_assigned_to (assigned_to),
ADD INDEX IF NOT EXISTS idx_status (status),
ADD INDEX IF NOT EXISTS idx_priority (priority),
ADD FOREIGN KEY IF NOT EXISTS fk_case_user (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
ADD FOREIGN KEY IF NOT EXISTS fk_case_assigned (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'case', 'assignment', 'progress', 'urgent') DEFAULT 'info',
    case_id INT NULL,
    complaint_id INT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (case_id) REFERENCES Case_filing(case_id) ON DELETE CASCADE,
    FOREIGN KEY (complaint_id) REFERENCES Makes_complaint(complaint_id) ON DELETE CASCADE
);

-- Insert sample users for testing
INSERT IGNORE INTO users (name, phone, password, role, thana_id) VALUES
('Admin User', '01711111111', '123456', 'user', NULL),
('Dhaka Thana Officer', '01722222222', '123456', 'thana-officer', 1),
('Warrant Officer Ahmed', '01733333333', '123456', 'warrant-officer', 1),
('Chittagong Thana Officer', '01744444444', '123456', 'thana-officer', 2),
('Warrant Officer Rahman', '01755555555', '123456', 'warrant-officer', 2),
('Regular User Karim', '01766666666', '123456', 'user', NULL),
('Regular User Fatima', '01777777777', '123456', 'user', NULL);

-- Update existing case status enum to include new statuses
ALTER TABLE Case_filing 
MODIFY COLUMN status ENUM('pending', 'assigned', 'in_progress', 'completed', 'closed') DEFAULT 'pending';

-- Update existing complaint status enum
ALTER TABLE Makes_complaint 
MODIFY COLUMN status ENUM('pending', 'under_review', 'case_created', 'resolved', 'rejected') DEFAULT 'pending';

-- Add sample data for testing
INSERT IGNORE INTO Makes_complaint (description, date, status, user_id, thana_id, crime_type, location, incident_date) VALUES
('চুরির ঘটনা - মোবাইল ফোন চুরি হয়েছে', '2024-09-20', 'pending', 6, 1, 'চুরি', 'ধানমন্ডি, ঢাকা', '2024-09-19'),
('রাস্তায় ছিনতাইয়ের ঘটনা', '2024-09-21', 'pending', 7, 1, 'ছিনতাই', 'গুলশান, ঢাকা', '2024-09-20');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_complaints_thana_status ON Makes_complaint(thana_id, status);
CREATE INDEX IF NOT EXISTS idx_cases_thana_status ON Case_filing(thana_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);