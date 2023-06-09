const express = require('express');
const router = new express.Router();
var mysql = require('mysql')
const crypto = require('crypto')
const CryptoJS = require("crypto-js");

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

router.get('/groupList', function (req, res, next) {
  connection.query('SELECT `name` FROM `groups`;', function (err, rows) {
    if (err) {
      console.log(err)
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: err })
    } else {
      res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: rows })
    }
  })
})
router.post('/test', function (req, res, next) {
  
  connection.query(`SELECT secret FROM users WHERE username = '${req.body.userName}' ;`, function (err, rows) {
    if (err) {
      console.log(err)
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: err })
    } else {
      res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: rows })
    }
  })
})

router.post('/addGroup', function (req, res, next) {


  let post = {
    name: req.body.group_name,
    critical_flg: (req.body.critial_flg) ? req.body.critial_flg : 'N'
  }

  var dbResult = connection.query('INSERT INTO `groups` SET ?', post, function (error, results, fields) {
    if (error) {
      console.log(error)
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: error })
    } else {
      res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: results })
    }
  });

  console.log(dbResult.sql); 
})

router.delete('/deleteGroup/:name', function (req, res, next) {

  connection.query('DELETE FROM `groups` WHERE `name` = ' + ` '${req.params.name}' ;`, function (error, results, fields) {
    if (error) {
      console.log(error)
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: error })
    } else {
      res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: results })
    }
  })
})

router.post('/addCredentials', function (req, res, next) {

  connection.query(`SELECT secret FROM users WHERE username = '${req.body.userName}' ;`, function (err, rows) {
    if (err) {
      console.log(err)
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: err })
    } else {
      // console.log(rows[0].secret)
      var ciphertext = CryptoJS.AES.encrypt(req.body.cred_pw, rows[0].secret).toString();

      let post = {
        userName: req.body.userName,
        groupName: req.body.groupName,
        systemName: req.body.systemName,
        cred_user: req.body.cred_user,
        cred_pw: ciphertext
      }

      var dbResult = connection.query('INSERT INTO stored_credentials SET ?', post, function (error, results, fields) {
        if (error) {
          console.log(error)
          res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: error })
        } else {
          res.status(201).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: results })
        }
      });
    
      console.log(dbResult.sql); 

    }
  })

  
})

router.get('/getCredentials/:username', function (req, res, next) {

  let query = 'SELECT a.*, b.critical_flg FROM stored_credentials a INNER JOIN `groups` b ON (a.groupName = b.`name`) '

  if(req.params.username) query += ` WHERE a.userName = '${req.params.username}' `

  connection.query(query, function (err, rows) {
    if (err) {
      console.log(err)
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: err })
    } else {
      res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: rows })
    }
  })
})


router.post('/deleteCredential', function (req, res, next) {

  let query = ` DELETE FROM stored_credentials 
                  WHERE userName = '${req.body.userName}'
                    AND groupName = '${req.body.groupName}' 
                    AND systemName = '${req.body.systemName}' 
                    AND cred_user = '${req.body.credUser}' ; `

  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error)
      res.status(500).json({ STATUS: "500", CODE: "E", MSG: "common.error", RETURN: error })
    } else {
      res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: results })
    }
  })
})

module.exports = router


