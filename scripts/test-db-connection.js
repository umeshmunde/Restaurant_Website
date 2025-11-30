require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || undefined,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : (process.env.PORT && !isNaN(parseInt(process.env.PORT,10)) ? parseInt(process.env.PORT,10) : 3306),
    connectTimeout: 5000,
  };

  console.log('Using DB config:', {
    host: config.host,
    user: config.user,
    database: config.database,
    port: config.port,
  });

  try {
    const conn = await mysql.createConnection(config);
    const [rows] = await conn.execute('SELECT 1 AS ok');
    console.log('Query succeeded:', rows);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('DB connection failed:');
    console.error(err && err.message ? err.message : err);
    if (err && err.code) console.error('Error code:', err.code);
    process.exit(1);
  }
})();
