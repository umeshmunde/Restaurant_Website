# Book a Table - Complete Setup Guide

## ✅ What's Already Set Up

Your "Book a Table" system is fully configured and ready to use!

### 1. **Database Table** ✅
The `bookings` table is created in MySQL with these fields:
- `id` - Auto-increment ID
- `full_name` - Customer's name
- `email_address` - Customer's email
- `total_person` - Number of people (INT)
- `booking_date` - Date and time (DATETIME)
- `message` - Additional message
- `created_at` - Timestamp

### 2. **Frontend Form** ✅
Located in the footer section of `index.html`:
- Name input
- Email input
- Number of persons dropdown (1-6+)
- Date & time picker
- Message textarea
- Submit button

### 3. **Backend API** ✅
Endpoint: `POST /api/book-table`
- Validates all required fields
- Saves booking to MySQL database
- Returns success/error response

### 4. **JavaScript Handler** ✅
Located in `assets/js/script.js`:
- Handles form submission
- Sends data to backend API
- Shows success/error messages
- Resets form on success

## 🚀 How to Use

### Step 1: Start the Server
```powershell
cd Restaurant_Website
npm start
```

### Step 2: Open Your Website
Go to: `http://localhost:3000`

### Step 3: Fill Out the Booking Form
1. Scroll to the footer section
2. Fill in:
   - Your Name
   - Email Address
   - Number of Persons (select from dropdown)
   - Date & Time (use the datetime picker)
   - Message
3. Click "Book a Table"

### Step 4: View Bookings

**In Admin Dashboard:**
- Go to: `http://localhost:3000/admin`
- Click on "Bookings" tab
- See all table reservations

**In MySQL Workbench:**
```sql
USE restaurant_db;
SELECT * FROM bookings ORDER BY created_at DESC;
```

## 📋 SQL Queries for Bookings

### View All Bookings
```sql
SELECT * FROM bookings ORDER BY created_at DESC;
```

### View Today's Bookings
```sql
SELECT * FROM bookings WHERE DATE(booking_date) = CURDATE();
```

### View Upcoming Bookings
```sql
SELECT * FROM bookings WHERE booking_date >= NOW() ORDER BY booking_date ASC;
```

### Count Total Bookings
```sql
SELECT COUNT(*) AS total_bookings FROM bookings;
```

### View Bookings by Customer
```sql
SELECT * FROM bookings WHERE full_name LIKE '%John%';
```

### Delete a Booking (if needed)
```sql
DELETE FROM bookings WHERE id = 1;
```

## 🔧 Troubleshooting

### Booking Not Saving?
1. Check if MySQL server is running
2. Verify `.env` file has correct MySQL credentials
3. Check server console for error messages
4. Verify database and table exist:
   ```sql
   USE restaurant_db;
   SHOW TABLES;
   DESCRIBE bookings;
   ```

### Form Not Submitting?
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify server is running on port 3000
4. Check network tab for API errors

### Database Connection Error?
1. Verify MySQL is running
2. Check `.env` file credentials
3. Test connection:
   ```sql
   mysql -u root -p
   ```

## 📝 Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| full_name | text | Yes | Customer's full name |
| email_address | email | Yes | Customer's email |
| total_person | select | Yes | Number of people (1-6+) |
| booking_date | datetime-local | Yes | Date and time for reservation |
| message | textarea | Yes | Additional message/notes |

## ✨ Features

- ✅ Form validation (all fields required)
- ✅ Date & time picker
- ✅ Success/error messages
- ✅ Form reset after successful booking
- ✅ Data saved to MySQL database
- ✅ View bookings in admin dashboard
- ✅ Automatic timestamp creation

Your "Book a Table" system is ready to use! 🎉

