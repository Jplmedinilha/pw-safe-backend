const express = require('express');
const router = new express.Router();
var mysql = require('mysql')
const crypto = require('crypto')

const connection = mysql.createConnection({
  host: process.env.DB_IP,
  user: process.env.DB_USR, 
  password: process.env.DB_PW, 
  database: process.env.DB_SCHEMA,
})

connection.connect((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Database connected')
})

router.get('/userList', function (req, res, next) {
  connection.query('SELECT name, email FROM users;', function (err, rows) {
    if (err) {
      console.log(err)
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: err })
    } else {
      res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: rows[0] })
    }
  })
})

router.get('/login', function (req, res, next) {
  const hash = crypto.createHash('sha256').update(req.query.pw).digest('hex');
  connection.query(`SELECT COUNT(*) as CNT FROM users WHERE username = '${req.query.username}' AND password = '${hash}'; `, function (err, rows) {
    if (err) {
      console.log(err)
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: err })
    } else {
      console.log(rows)
      res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: rows[0] })
    }
  })
})


module.exports = router


