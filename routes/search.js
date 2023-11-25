const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  res.send("ahahahaha")
})
router.get('/', (req, res) => {
  res.send("LOLILOL")
})

module.exports = router