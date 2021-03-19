const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const { ObjectID, MongoClient } = require('mongodb')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME
const collectionName = 'users'

router.post('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/login')
        }
    })
})

module.exports = router
