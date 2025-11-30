# Database Setup Guide

This guide will help you set up the MySQL database for the restaurant booking system.

## Prerequisites

1. MySQL Server installed and running
2. Node.js and npm installed
3. Dependencies installed (`npm install`)

## Quick Setup

### Step 1: Create `.env` file

Create a `.env` file in the `Restaurant_Website` folder with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=restaurant_db
PORT=3000
```

Replace `your_mysql_password` with your actual MySQL root password.

### Step 2: Run the setup script

From the `Restaurant_Website` folder, run:

```bash
npm run setup-db
```

This will:
- Create the `restaurant_db` database (if it doesn't exist)
- Create the `bookings` table for table reservations
- Create the `orders` table for food orders

### Step 3: Verify setup

The script will show you which tables were created. You should see:
- `bookings` - for table reservations
- `orders` - for food orders

## Manual Setup (Alternative)

If you prefer to set up manually:

1. Open MySQL Workbench or MySQL command line
2. Connect to your MySQL server
3. Run these commands:

```sql
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;
```

4. Then run the contents of `schema.sql` file

## Database Schema

### Bookings Table
Stores table reservation information:
- `id` - Auto-increment primary key
- `full_name` - Customer's full name
- `email_address` - Customer's email
- `total_person` - Number of people
- `booking_date` - Date and time of reservation
- `message` - Additional message from customer
- `created_at` - Timestamp when booking was created

### Orders Table
Stores food order information:
- `id` - Auto-increment primary key
- `customer_name` - Customer's name
- `customer_email` - Customer's email (optional)
- `customer_phone` - Customer's phone number
- `customer_address` - Delivery address
- `item_name` - Name of the food item
- `item_price` - Price of the item
- `quantity` - Quantity ordered
- `created_at` - Timestamp when order was created

## Troubleshooting

### Error: Access denied
- Check your MySQL username and password in `.env`
- Make sure MySQL server is running
- Verify the user has permission to create databases

### Error: Connection refused
- Make sure MySQL server is running
- Check if `DB_HOST` in `.env` is correct (usually `localhost`)

### Error: Database already exists
- This is fine! The script will use the existing database
- Tables will be created if they don't exist

## Testing the Connection

After setup, you can test the connection by starting the server:

```bash
npm start
```

If the server starts without database errors, your setup is successful!

