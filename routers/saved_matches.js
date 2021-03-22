const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME

db.initialize(
    dbName,
    (dbObject) => {
        router.get('/savedmatches', (req, res) => {
            let loggedUser = req.session.loggedInUser;
            let loggedIn = loggedUser.toString()
            console.log("logged in user:")
            console.log(loggedIn);
            dbObject
                .collection('users')
                .findOne({ _id: mongo.ObjectId(loggedIn)}) //id van 'ingelogde persoon'
                .then((results) => {
                    let matches = results.LikedProfiles
                    console.log(results.LikedProfiles)
                    let foundProfiles = []

                    async function getLikedProfiles(matches) {
                        for (i = 0; i < matches.length; i++) {
                            const pullProfile = await dbObject
                                .collection('users')
                                .findOne({
                                    _id: mongo.ObjectId(matches[i]),
                                })
                                console.log(pullProfile);
                            foundProfiles.push(pullProfile)
                        }

                        // Render saved_matches with filtered array
                        res.render('pages/saved_matches', {
                            data: foundProfiles,
                            title: 'Saved matches',
                        })
                    }

                    getLikedProfiles(matches)
                })
        })

        router.delete('/savedmatches', (req, res) => {
            let loggedUser = req.session.loggedInUser;
            let loggedIn = loggedUser.toSting()
            console.log('Delete request')
            dbObject
                .collection('users')
                .updateOne(
                    { _id: mongo.ObjectId(logedIn) }, //id of 'logged in person'
                    { $pull: { LikedProfiles: req.body.userId } }
                ) // wat er geupdate moet worden
                .then((results) => {
                    res.redirect('/savedmatches')
                })

            dbObject
                .collection('users')
                .find()
                .toArray()
                .then((results) => {
                    res.render('pages/saved_matches', {
                        data: results,
                        title: 'Saved matches',
                    })
                })
        })
    },
    (err) => {
        throw err
    }
)

module.exports = router
