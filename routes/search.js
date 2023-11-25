const express = require('express')
const router = express.Router()
const pool = require('../db/db')

router.post('/', (req, res) => {
  const symptoms = "'" + req.body.symptoms.join("','") + "'"
  const english = req.body.englishOnly
  let query = `SELECT h.name, h.long, h.lat, 
  (SELECT string_agg(s2.name, ',') FROM hospital h2 
    INNER JOIN doctor as d2 on d2.hospital_id = h2.id
    INNER JOIN doctor_illness as di2 on di2.doctor_id = d2.id
    INNER JOIN illness as i2 on i2.id = di2.illness_id
    INNER JOIN illness_symptom as ils2 on ils2.illness_id = i2.id
    INNER JOIN symptom s2 on ils2.symptom_id = s2.id where h2.id = h.id) as symptoms,
  COUNT(DISTINCT s.id) as matched_symptom_count FROM hospital as h
  INNER JOIN doctor as d on d.hospital_id = h.id
  INNER JOIN doctor_illness as di on di.doctor_id = d.id
  INNER JOIN illness as i on i.id = di.illness_id
  INNER JOIN illness_symptom as ils on ils.illness_id = i.id
  INNER JOIN symptom s on ils.symptom_id = s.id
  WHERE s.name IN (${symptoms}) GROUP BY h.id ORDER BY matched_symptom_count DESC`

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