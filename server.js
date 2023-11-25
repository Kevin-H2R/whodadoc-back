const express = require("express")
const searchRoutes = require("./routes/search")
const { Pool } = require('pg');

const pool = new Pool({
  user: 'bugbusters',
  host: 'dpg-clgsc8eg1b2c73aanck0-a.singapore-postgres.render.com',
  database: 'whodadoc',
  password: 'VQ95laLx9n2xjgQLVnkKc32RWHzUoPu9',
  port: 5432, // default PostgreSQL port,
  idleTimeoutMillis: 60000,
  ssl: true
});

pool.query('SELECT NOW() AS current_time', (err, result) => {
  if (err) {
    console.error('Error executing query', err);
    return;
  }

  console.log('Query result:', result.rows);
});

const app = express();

app.use('/search', searchRoutes)

app.get('/', (req, res) => {
  res.send('Successful responseeee.');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));