const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')

//const ObjectID = mongo.ObjectID

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME

db.initialize(dbName, (dbObject) => {
    router.get('/findmatches', (req, res) => {
        let loggedUser = req.session.loggedInUser
        let loggedIn = loggedUser.toString()
        dbObject
            .collection('users')
            .findOne({ _id: mongo.ObjectId(loggedIn) }) //id van 'ingelogde persoon'
            .then((profile) => {
                let favGenres = profile.FavGenres
                let foundGenres = []
                return dbObject
                    .collection('users')
                    .find({
                        _id: { $ne: mongo.ObjectId(loggedIn) },
                        FavGenres: { $in: favGenres },
                    })
                    .toArray()
            })
            .then((results) => {
                const allUsersfavGenres = results.map((genres) => {
                    return genres.FavGenres
                })
                res.render('pages/find_matches', {
                    data: results,
                    title: 'All matches',
                })
            })
    })
})
module.exports = router
