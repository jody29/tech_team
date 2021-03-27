const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')
const multer = require('multer')
const getAge = require('get-age')

const upload = multer({ dest: './public/images/profile' })
const fs = require('fs')
const auth = require('../authentication/auth')


// Database variables

const db = require('../connection/db')
const dbName = process.env.DB_NAME

const spotAPI = require('../public/scripts/convertMusic')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

db.initialize(
    dbName,
    (dbObject) => {
        router.get('/profile', auth, (req, res) => {
            let loggedUser = req.session.loggedInUser
            let loggedIn = loggedUser.toString()
            console.log('logged in user:')
            console.log(loggedIn)

            dbObject
                .collection('users')
                .findOne({ _id: mongo.ObjectId(loggedIn) }) //id van 'ingelogde persoon'
                .then((results) => {
                    // results.image = results.image.image.buffer
                    console.log(results)
                    
                    res.render('pages/profile', {
                        data: results,
                        title: 'Profile',
                    })
                })
        })
    },
    (err) => {
        throw err
    }
)

module.exports = router
