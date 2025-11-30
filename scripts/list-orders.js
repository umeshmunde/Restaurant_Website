require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || undefined,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    connectTimeout: 5000,
  };

  try {
    const conn = await mysql.createConnection(config);
    const [rows] = await conn.execute('SELECT id, customer_name, customer_phone, item_name, quantity, item_price, created_at FROM orders ORDER BY created_at DESC LIMIT 50');
    if (!rows.length) {
      console.log('No orders found in the `orders` table.');
    } else {
      console.table(rows);
    }
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Failed to query orders:');
    console.error(err && err.message ? err.message : err);
    if (err && err.code) console.error('Error code:', err.code);
    process.exit(1);
  }
})();
