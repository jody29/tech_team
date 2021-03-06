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


db.initialize(dbName, (dbObject) => {
    router.get('/', (req, res) => {
        res.render('pages/login', {
            title: 'Login Page',
            message: '',
        })
    })

    router.post('/login', async (req, res) => {
        const Username = req.body.Username
        const Password = req.body.Password
        try {
            const user = await dbObject.collection('users').findOne({
                Username: req.body.Username,
            })
            if (user == null) {
                return res.render('pages/login', {
                    title: 'Login Page',
                    message:'Your username or password is wrong. Please try again',
                })
            }

            const match = await bcrypt.compare(Password, user.Password)

            if (match) {
                req.session.loggedInUser = user._id
                req.session.userName = Username
                res.redirect('/findmatches')
            } else {
                res.render('pages/login', {
                    title: 'Login Page',
                    message:
                        'Your username or password is wrong. Please try again',
                })
            }
        } catch (err) {
            console.log(err)
        }
    })
})

module.exports = router
