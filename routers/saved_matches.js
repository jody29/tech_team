const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')
const chatService = require('../services/chatService')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME

db.initialize(
    dbName,
    (dbObject) => {
        router.get('/savedmatches', (req, res) => {
            let loggedUser = req.session.loggedInUser
            let loggedIn = loggedUser.toString()
            dbObject
                .collection('users')
                .findOne({ _id: mongo.ObjectId(loggedIn) }) //id van 'ingelogde persoon'
                .then((results) => {
                    let matches = results.LikedProfiles
                    console.log(
                        'mijn gelikete profiles zijn: ',
                        results.LikedProfiles
                    )
                    let foundProfiles = []

                    async function getLikedProfiles(matches) {
                        for (i = 0; i < matches.length; i++) {
                            const pullProfile = await dbObject
                                .collection('users')
                                .findOne({
                                    _id: mongo.ObjectId(matches[i]),
                                })
                            foundProfiles.push(pullProfile)
                        }
                        
                        res.render('pages/saved_matches', {
                            data: foundProfiles,
                            title: 'Saved matches',
                        })
                    }
                    getLikedProfiles(matches)
                })
        })

        router.delete('/savedmatches', (req, res) => {
            let loggedUser = req.session.loggedInUser
            let loggedIn = loggedUser.toString()

            dbObject
                .collection('users')
                .updateOne(
                    { _id: mongo.ObjectId(loggedIn) }, //id of 'logged in person'
                    { $pull: { LikedProfiles: req.body.userId } }
                ) // wat er geupdate moet worden
                .then((results) => {
                    res.redirect('/savedmatches')
                })

        })

        router.get('/profile/:id', (req, res) => {
            dbObject
                .collection('users')
                .findOne({ _id: mongo.ObjectId(req.params.id) })
                .then((results) => {
                    res.render('pages/other_profile.ejs', {
                        data: results,
                        title: 'My match',
                    })
                })
        })

        router.delete('/profile/:id', (req, res) => {
            let loggedUser = req.session.loggedInUser
            let loggedIn = loggedUser.toString()

            dbObject
                .collection('users')
                .updateOne(
                    { _id: mongo.ObjectId(loggedIn) }, //id of 'logged in person'
                    { $pull: { LikedProfiles: req.body.userId } }
                )
                .then(() => {
                    res.redirect('/savedmatches')
                })
        })
    },
    (err) => {
        throw err
    }
)

module.exports = router
