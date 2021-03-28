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
db.initialize(
    dbName,
    (dbObject) => {
        router.post('/like', (req, res) => {
            let loggedUser = req.session.loggedInUser
            let loggedIn = loggedUser.toString()
            let otherId = req.body.id
            let otherLiked = req.body.LikedProfiles

            dbObject
                .collection('users')
                .findOne({ _id: mongo.ObjectId(loggedIn) }) //id van 'ingelogde persoon'
                .then((loggedInProfile) => {
                    let likedProfiles = loggedInProfile.LikedProfiles

                    if (likedProfiles.includes(otherId)) {
                        console.log('User is already in your matches')
                    } else {
                        if (otherLiked.includes(mongo.ObjectID(loggedIn))) {
                            const createMatch = async (id, otherId) => {
                                try {
                                    await dbObject
                                        .collection('users')
                                        .updateOne(
                                            { _id: mongo.ObjectID(id) },
                                            {
                                                $push: {
                                                    MatchedProfiles: mongo.ObjectID(
                                                        otherId
                                                    ),
                                                },
                                            }
                                        )

                                    await dbObject
                                        .collection('users')
                                        .updateOne(
                                            { _id: mongo.ObjectId(id) },
                                            {
                                                $push: {
                                                    LikedProfiles: mongo.ObjectID(
                                                        otherId
                                                    ),
                                                },
                                            }
                                        )

                                    await dbObject
                                        .collection('users')
                                        .updateOne(
                                            {
                                                _id: mongo.ObjectID(otherId),
                                            },
                                            {
                                                $push: {
                                                    MatchedProfiles: mongo.ObjectID(
                                                        loggedIn
                                                    ),
                                                },
                                            }
                                        )

                                    const lastChat = await dbObject
                                        .collection('chats')
                                        .findOne(
                                            {},
                                            {
                                                sort: { chatNumber: -1 },
                                                limit: 1,
                                            }
                                        )
                                    const chatNumber =
                                        lastChat === null
                                            ? 0
                                            : lastChat.chatNumber + 1

                                    await dbObject
                                        .collection('chats')
                                        .insertOne({
                                            chatNumber: chatNumber,
                                            users: [id, otherId],
                                            messages: [],
                                        })
                                } catch (err) {
                                    throw err
                                }
                            }

                            createMatch(
                                mongo.ObjectID(loggedIn),
                                mongo.ObjectID(otherId)
                            )

                            res.redirect('/findmatches')
                        } else {
                            dbObject.collection('users').updateOne(
                                { _id: mongo.ObjectID(loggedIn) },
                                {
                                    $push: {
                                        LikedProfiles: mongo.ObjectID(otherId),
                                    },
                                }
                            )

                            res.redirect('/findmatches')
                        }
                    }
                })
        })
    },
    (err) => {
        console.log(err)
    }
)

module.exports = router
