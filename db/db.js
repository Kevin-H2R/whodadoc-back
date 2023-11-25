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

module.exports = pool;