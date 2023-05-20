const express = require('express');
const router = new express.Router();
var mysql = require('mysql')


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
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: null })
    } else {
      res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: rows[0] })
    }
  })
})



module.exports = router


