const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')
const { ObjectID, MongoClient } = require('mongodb')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME

//liking a profile
db.initialize(dbName, (dbObject) => {
    router.post('/like', (req, res) => {
        let loggedUser = req.session.loggedInUser
            let loggedIn = loggedUser.toString()

            console.log('post request')
            dbObject
                .collection('users')
                .updateOne(
                    { _id: mongo.ObjectId(loggedIn) }, //id of 'logged in person'
                    { $push: { LikedProfiles: req.body.id } }
                ) // wat er geupdate moet worden
                .then((results) => {
                    res.redirect('/findmatches')
                })
    })
})

module.exports = router
