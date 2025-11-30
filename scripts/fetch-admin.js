const http = require('http');

function fetch(path) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 4000, path, method: 'GET' };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    console.log('GET /api/admin/orders');
    const orders = await fetch('/api/admin/orders');
    console.log('Status:', orders.status);
    console.log(orders.body);
  } catch (e) {
    console.error('Orders fetch failed:', e && e.message ? e.message : e);
  }

  console.log('\n---\n');

  try {
    console.log('GET /api/admin/bookings');
    const bookings = await fetch('/api/admin/bookings');
    console.log('Status:', bookings.status);
    console.log(bookings.body);
  } catch (e) {
    console.error('Bookings fetch failed:', e && e.message ? e.message : e);
  }
})();
