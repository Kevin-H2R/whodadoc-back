const express = require('express')
const router = express.Router()
const pool = require('../db/db')

router.get('/:id', (req, res) => {
  const docId = req.params.id
  const query = `SELECT d.*, string_agg(i.name, ', ') as illnesses FROM doctor as d
    INNER JOIN doctor_illness di on di.doctor_id = d.id
    INNER JOIN illness i on di.illness_id = i.id
    WHERE d.id = ${docId} GROUP BY d.id`
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return;
    }
    console.log('Query result:', result.rows);
    res.send(result.rows)
  })
})

module.exports = router