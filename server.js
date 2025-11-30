const path = require('path');
const express = require('express');
// Load environment variables from .env when present (local dev)
require('dotenv').config();

const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (front-end)
app.use(express.static(__dirname));

// Table/booking endpoint (stored in local JSON file)
app.post('/api/book-table', async (req, res) => {
  const { full_name, email_address, total_person, booking_date, message } = req.body || {};

  if (!full_name || !email_address || !total_person || !booking_date || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    const created_at = new Date();
    const [result] = await pool.execute(
      'INSERT INTO bookings (full_name, email_address, total_person, booking_date, message, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email_address, total_person, booking_date, message, created_at]
    );

    const newBooking = {
      id: result.insertId,
      full_name,
      email_address,
      total_person,
      booking_date,
      message,
      created_at: created_at.toISOString(),
    };

    console.log('New booking saved (db):', newBooking);

    return res.json({ success: true, message: 'Your table has been booked successfully!', booking: newBooking });
  } catch (error) {
    console.error('DB error (book-table):', error);
    return res.status(500).json({ success: false, message: 'Could not save booking. Please try again later.' });
  }
});

// Place order endpoint (stored in local JSON file)
app.post('/api/place-order', async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    item_name,
    item_price,
    quantity,
  } = req.body || {};

  if (
    !customer_name ||
    !customer_phone ||
    !customer_address ||
    !item_name ||
    !item_price ||
    !quantity
  ) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields to place the order.' });
  }

  try {
    // normalize phone: digits-only and use last 10 digits to canonicalize
    const normalizePhone = (s) => {
      if (!s) return null;
      const digits = s.toString().replace(/\D/g, '');
      return digits.length > 10 ? digits.slice(-10) : digits;
    };

    const phoneNormalized = normalizePhone(customer_phone);

    const created_at = new Date();
    const [result] = await pool.execute(
      'INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, item_name, item_price, quantity, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [customer_name, customer_email || null, phoneNormalized, customer_address, item_name, item_price, quantity, created_at]
    );

    const newOrder = {
      id: result.insertId,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      item_name,
      item_price,
      quantity,
      created_at: created_at.toISOString(),
    };

    console.log('New order saved (db):', newOrder);

    return res.json({ success: true, message: 'Your order has been placed successfully!', order: newOrder });
  } catch (error) {
    console.error('DB error (place-order):', error);
    return res.status(500).json({ success: false, message: 'Could not place order. Please try again later.' });
  }
});

// Admin: fetch all orders
app.get('/api/admin/orders', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
    return res.json({ success: true, orders: rows });
  } catch (error) {
    console.error('DB error (admin orders):', error);
    return res.status(500).json({ success: false, message: 'Could not load orders. Please try again later.' });
  }
});

// Admin: fetch all bookings
app.get('/api/admin/bookings', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM bookings ORDER BY created_at DESC');
    return res.json({ success: true, bookings: rows });
  } catch (error) {
    console.error('DB error (admin bookings):', error);
    return res.status(500).json({ success: false, message: 'Could not load bookings. Please try again later.' });
  }
});

// Admin dashboard page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

