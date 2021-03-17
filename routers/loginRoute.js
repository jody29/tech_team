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
db.initialize(dbName, collectionName, (dbCollection) => {
    router.post('/login', async (req, res) => {
        const Username = req.body.Username
        const Password = req.body.Password
        try {
            const user = await dbCollection.findOne({
                Username: req.body.Username,
            })
            if (user == null) {
                return res.status(400).send('Username does not exist')
            }
            console.log('user is:', user) // gives an object with all the data from DB

            console.log('req body username: ', req.body.Username)
            console.log('const user :', Username)
            console.log('password: ', req.body.Password)

            //const match = await bcrypt.compare(Password, user.Password)
            const isPWcorr = Password == user.Password
            console.log('req body password: ', req.body.Password)

            console.log('check if correct pw: ', isPWcorr)

            //change isPWcorr to match when password is crypted through register
            if (isPWcorr) {
                //req.session.activeUser = user._id
                res.render('pages/profile', {
                    title: 'Profile',
                })
            } else {
                res.render('pages/login_fail', {
                    title: 'Login Fail Page',
                })
            }
        } catch (err) {
            console.log(err)
        }
    })
    //     router.post('/Login', (req, res) => {
    //         const Username = req.body.Username
    //         const Password = req.body.Password
    //         console.log('Username is: ', Username)
    //         console.log('Passowrd is: ', Password)
    //         dbCollection.findOne({ Username: Username }, (err, results) => {
    //             console.log('the result are: ', results)
    //             if (err) throw err
    //             if (results && results.password === Password) {
    //                 req.session.sessionID = user._id
    //                 res.render('pages/profile', {
    //                     data: results,
    //                     title: 'Profile',
    //                 })
    //             } else {
    //                 res.render('pages/login', {
    //                     data: results,
    //                     title: 'Login',
    //                 })
    //             }
    //         })
    //     })
    // },
    // (err) => {
    //     throw err
})

module.exports = router
