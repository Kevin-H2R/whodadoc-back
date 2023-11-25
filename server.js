const express = require("express")
const searchRoutes = require("./routes/search")
const doctorRoutes = require("./routes/doctor")
const hospitalRoutes = require("./routes/hospital")
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.use('/search', searchRoutes)
app.use('/doctors', doctorRoutes)
app.use('/hospitals', hospitalRoutes)

app.listen(3000, () => console.log('Example app is listening on port 3000.'));