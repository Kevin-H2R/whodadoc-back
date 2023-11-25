const express = require("express")
const searchRoutes = require("./routes/search")
const pool = require('./db/db')
const bodyParser = require('body-parser')

pool.query('SELECT NOW() AS current_time', (err, result) => {
  if (err) {
    console.error('Error executing query', err);
    return;
  }

  console.log('Query result:', result.rows);
});

const app = express();

app.use(bodyParser.json())

app.use('/search', searchRoutes)

app.get('/', (req, res) => {
  res.send('Successful responseeee.');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));