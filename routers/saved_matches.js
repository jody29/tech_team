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
                    let matches = results.MatchedProfiles
                    // console.log(results.LikedProfiles)
                    let user = results
                    let foundProfiles = []
                    let userChat = []
                    let chats = []

                    const getLikedProfiles = async (data) => {
                        for (let i = 0; i < data.length; i++) {
                            const pullProfile = await dbObject
                                .collection('users')
                                .findOne({
                                    _id: mongo.ObjectId(data[i]),
                                })
                            if (pullProfile) {
                                foundProfiles.push(pullProfile)
                            }

                            // console.log(userChat)
                        }

                        // This piece of code was sponsored by Jonah Meijers
                        foundProfiles.forEach(async (profile) => {
                            userChat.push(
                                dbObject
                                    .collection('chats')
                                    .findOne({
                                        users: {
                                            $all: [profile._id, user._id],
                                        },
                                    })
                                    .then((result) => {
                                        result.users = result.users.map(
                                            (user) => user.toHexString()
                                        )
                                        return result
                                    })
                            )
                            profile._id = profile._id.toHexString()
                        })

                        const allChats = await Promise.all(userChat)

                        chats = allChats

                        console.log(chats)
                        console.log(foundProfiles)

                        res.render('pages/saved_matches', {
                            data: foundProfiles,
                            title: 'Saved matches',
                            chats: chats,
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
                    {
                        $pull: {
                            LikedProfiles: mongo.ObjectID(req.body.userId),
                        },
                    }
                ) // wat er geupdate moet worden
                .then((results) => {
                    res.redirect('/savedmatches')
                })

            dbObject.collection('chats').deleteOne({
                users: {
                    $all: [
                        mongo.ObjectID(loggedIn),
                        mongo.ObjectID(req.body.userId),
                    ],
                },
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
