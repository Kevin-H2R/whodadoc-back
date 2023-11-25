const express = require('express')
const router = express.Router()
const pool = require('../db/db')

router.post('/', (req, res) => {
  const symptoms = "'" + req.body.symptoms.join("','") + "'"
  const english = req.body.english
  let query = `SELECT DISTINCT h.name, h.long, h.lat FROM hospital as h
  INNER JOIN doctor as d on d.hospital_id = h.id
  INNER JOIN doctor_illness as di on di.doctor_id = d.id
  INNER JOIN illness as i on i.id = di.illness_id
  INNER JOIN illness_symptom as ils on ils.illness_id = i.id
  INNER JOIN symptom s on ils.symptom_id = s.id
  WHERE s.name IN (${symptoms})`

  if (english) {
    query += " AND d.english = true"
  }
  console.log(query)
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return;
    }
  
    console.log('Query result:', result.rows);
    res.send(result.rows)
  })
})
router.get('/', (req, res) => {
  res.send("LOLILOL")
})

module.exports = router