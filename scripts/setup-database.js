/**
 * Database Setup Script
 * Creates the restaurant_db database and tables for bookings and orders
 * 
 * Usage: node scripts/setup-database.js
 * 
 * Make sure to set your MySQL credentials in .env file first:
 * DB_HOST=localhost
 * DB_USER=root
 * DB_PASSWORD=your_password
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;

  try {
    // Connect to MySQL (without specifying database first)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('✓ Connected to MySQL server');

    // Create database
    const dbName = process.env.DB_NAME || 'restaurant_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✓ Database '${dbName}' created or already exists`);

    // Switch to the database
    await connection.query(`USE \`${dbName}\``);

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split by semicolons and execute each statement
      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement) {
          await connection.query(statement);
        }
      }
      console.log('✓ Tables created successfully');
    } else {
      // Create tables manually if schema.sql doesn't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INT PRIMARY KEY AUTO_INCREMENT,
          full_name VARCHAR(255) NOT NULL,
          email_address VARCHAR(255) NOT NULL,
          total_person INT NOT NULL,
          booking_date DATETIME NOT NULL,
          message TEXT NOT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await connection.query(`
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
        )
      `);
      console.log('✓ Tables created successfully');
    }

    // Verify tables exist
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n✓ Database setup complete!');
    console.log('  Tables created:');
    tables.forEach(table => {
      console.log(`    - ${Object.values(table)[0]}`);
    });

  } catch (error) {
    console.error('✗ Error setting up database:');
    console.error(error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n  Please check your MySQL credentials in .env file');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n  Please make sure MySQL server is running');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupDatabase();

