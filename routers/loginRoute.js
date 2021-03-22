const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const { ObjectID, MongoClient } = require('mongodb')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME

const bcrypt = require('bcrypt')
const { compare } = require('bcrypt')
const saltRounds = 10
//Login Page route
router.get('/login', (req, res) => {
    res.render('pages/login', {
        title: 'Login Page',
    })
})

//login
db.initialize(dbName, (dbObject) => {
    router.post('/login', async (req, res) => {
        const Username = req.body.Username
        const Password = req.body.Password
        try {
            const user = await dbObject.collection('users').findOne({
                Username: req.body.Username,
            })
            if (user == null) {
                return res.status(400).send('Username does not exist')
            }

            //const match = await bcrypt.compare(Password, user.Password)
            const isPWcorr = Password == user.Password

            //change isPWcorr to match when password is crypted through register
            if (isPWcorr) {
                req.session.loggedInUser = user._id
                req.session.userName = Username
                res.redirect('/savedmatches')
            } else {
                res.render('pages/login_fail', {
                    title: 'Login Fail Page',
                })
            }
        } catch (err) {
            console.log(err)
        }
    })
})

module.exports = router
