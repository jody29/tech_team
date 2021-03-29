const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')
const auth = require('../authentication/auth')

//const ObjectID = mongo.ObjectID

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME

db.initialize(dbName, (dbObject) => {
    router.get('/findmatches', auth, (req, res) => {
        let loggedUser = req.session.loggedInUser
        let loggedIn = loggedUser.toString()
        dbObject
            .collection('users')
            .findOne({ _id: mongo.ObjectId(loggedIn) })
            .then((profile) => {
                let favGenres = profile.FavGenres
                return dbObject
                    .collection('users')
                    .find({
                        $and: [
                            { _id: { $nin: profile.LikedProfiles }, },
                            { _id: { $ne: mongo.ObjectId(loggedIn) } },
                            { FavGenres: { $in: favGenres } },
                        ],
                    })
                    .toArray()
            })
            .then((results) => {
                const allUsersfavGenres = results.map((genres) => {
                    return genres.FavGenres
                })
                res.render('pages/find_matches', {
                    data: results,
                    title: 'Find matches',
                })
            })
    })
})
module.exports = router
