const express = require('express')
const router = express.Router()
const pool = require('../db/db')
const axios = require('axios')
const levenshtein = require('js-levenshtein');

const makeQueryForSymptoms = (symptoms, english) => {
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
  WHERE s.name IN (${symptoms})`

  if (english) {
    query += " AND d.english = true"
  }
  query += ' GROUP BY h.id ORDER BY matched_symptom_count DESC'
  return query
}

router.post('/', (req, res) => {
  if (req.body.prompt) {
    return aiComputing(req, res)
  }
  const symptoms = "'" + req.body.symptoms.join("','") + "'"
  const english = req.body.englishOnly
  const query = makeQueryForSymptoms(symptoms, english)
  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      return;
    }
  
    console.log('Query result:', result.rows);
    res.send(result.rows)
  })
})

const aiComputing = (req, res) => {
  pool.query('SELECT name from symptom', async (err, result) => {
    const symptomList = result.rows.join(',')
    const response = await axios.post('https://us-central1-chat-for-chatgpt.cloudfunctions.net/basicUserRequestBeta', {
      data: {message: `Please, in this text: "${req.body.prompt}"
      Tell me which symptoms do I have. Only pick answers from this list: (${symptomList}).
      Start the symptoms list with the word 'whodadoc', then give the symptoms separated by a comma if necessary. `}
    })
    const answer = response.data.result.choices[0].text
    console.log(answer)
    const symptomsStr = answer.split('whodadoc')[1]
    const symptoms = symptomsStr.split(',')
    const likelySymptoms = []
    symptoms.forEach(s => {
      if (s.trim().length < 3) return
      const tmp = s.trim().toLowerCase()
      const parts = tmp.split(' ')
      parts.forEach(p => {
      if (p.length < 3) return
        result.rows.forEach(o => {
          if (!likelySymptoms.includes(o.name) && levenshtein(o.name.toLowerCase(), p) < (o.name.length) / 3) {
            likelySymptoms.push(o.name)
          }
        })
      })
    })
    console.log(likelySymptoms)
    const formattedLikelySymptoms = "'" + likelySymptoms.join("','") + "'"
    const queryHospitals = makeQueryForSymptoms(formattedLikelySymptoms, req.body.englishOnly)
    pool.query(queryHospitals, (err, result) => {
      if (err) {
        console.error('Error executing query', err);
        return;
      }
      console.log('Query result:', result.rows);
      res.send(result.rows)
    })
  })
}

module.exports = router