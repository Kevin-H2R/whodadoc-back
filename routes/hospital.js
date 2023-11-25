const express = require('express')
const router = express.Router()
const pool = require('../db/db')

router.get('/:id', (req, res) => {
  console.log(req.params.id)
  const hospitalId = req.params.id
  const query = `SELECT h.*, d.* FROM hospital as h
  INNER JOIN doctor as d on d.hospital_id = h.id
  WHERE h.id = ${hospitalId}`
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return;
    }
    const formatted = result.rows.reduce((acc, row) => {
      console.log('ACC: ')
      console.log(Object.keys(acc).includes(row.hospital_id))
      if (!(row.hospital_id in acc)) {
        acc[row.hospital_id] = {
         name: row.name,
         long: row.long,
         lat: row.lat,
         hour_start: row.hour_start,
         hour_end: row.hour_end,
         profile_image: row.profile_image,
         address: row.address,
         doctors: [] 
        }
      }
      acc[row.hospital_id]['doctors'].push({
        firstname: row.firstname, lastname: row.lastname, english: row.english
      })
      // console.log(acc[16])
      return acc
    }, {})
    // console.log(formatted)
    res.send(formatted)
  })
})

module.exports = router