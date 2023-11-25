const express = require("express")
const searchRoutes = require("./routes/search")
const pool = require('./db/db')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.use('/search', searchRoutes)

app.get('/', (req, res) => {
  res.send('Successful responseeee.');
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));