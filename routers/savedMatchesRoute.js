const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')
const auth = require('../authentication/auth')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME

db.initialize(
    dbName,
    (dbObject) => {
        router.get('/savedmatches', auth, (req, res) => {
            let loggedUser = req.session.loggedInUser
            let loggedIn = loggedUser.toString()
            dbObject
                .collection('users')
                .findOne({ _id: mongo.ObjectId(loggedIn) })
                .then((results) => {
                    let matches = results.MatchedProfiles

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
            let otherUser = req.body.userId

            const deleteMatch = async (loggedIn, otherUser) => {
                try {
                    await dbObject
                        .collection('users')
                        .updateOne(
                            { _id: mongo.ObjectId(loggedIn) }, 
                            {
                                $pull: {
                                    MatchedProfiles: mongo.ObjectID(otherUser),
                                },
                            }
                        ) 
                        .then((results) => {
                            res.redirect('/savedmatches')
                        })

                    await dbObject.collection('users').updateOne(
                        { _id: mongo.ObjectID(otherUser) },
                        {
                            $pull: {
                                MatchedProfiles: mongo.ObjectID(loggedIn),
                            },
                        }
                    )

                    await dbObject.collection('chats').deleteOne({
                        users: {
                            $all: [
                                mongo.ObjectID(loggedIn),
                                mongo.ObjectID(otherUser),
                            ],
                        },
                    })
                } catch (err) {
                    throw err
                }
            }

            deleteMatch(loggedIn, otherUser)
        })

        router.get('/profile/:id', auth, (req, res) => {
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
            let otherUser = req.body.userId

            const deleteMatch = async (id, otherId) => {
                try {
                    await dbObject.collection('users').updateOne(
                        { _id: mongo.ObjectId(id) }, 
                        {
                            $pull: {
                                MatchedProfiles: otherId,
                            },
                        }
                    )

                    await dbObject.collection('users').updateOne(
                        { _id: mongo.ObjectId(id) }, 
                        {
                            $pull: {
                                LikedProfiles: otherId,
                            },
                        }
                    )

                    await dbObject.collection('users').updateOne(
                        { _id: mongo.ObjectID(otherId) },
                        {
                            $pull: {
                                MatchedProfiles: id,
                            },
                        }
                    )

                    await dbObject.collection('chats').deleteOne({
                        users: {
                            $all: [mongo.ObjectID(id), mongo.ObjectID(otherId)],
                        },
                    })
                } catch (err) {
                    throw err
                }
            }

            deleteMatch(loggedIn, otherUser)
        })
    },
    (err) => {
        throw err
    }
)

module.exports = router
