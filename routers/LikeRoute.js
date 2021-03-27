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

        dbObject
            .collection('users')
            .findOne({ _id: mongo.ObjectId(loggedIn) }) //id van 'ingelogde persoon'
            .then((loggedInProfile) => {
                let likedProfiles = loggedInProfile.LikedProfiles

                if (likedProfiles.includes(req.body.id)) {
                    console.log('User is already in your matches')
                } else {
                    let otherLiked = []
                    const otherUser = dbObject
                        .collection('users')
                        .findOne({ _id: mongo.ObjectID(req.body.id) })
                        .then((result) => {
                            otherLiked.push(result.likedProfiles)
                        })

                    if (otherLiked.includes(mongo.ObjectID(loggedIn))) {
                        dbObject
                            .collection('users')
                            .updateOne(
                                { _id: mongo.ObjectID(loggedIn) },
                                {
                                    $push: {
                                        LikedProfiles: mongo.ObjectID(
                                            req.body.id
                                        ),
                                    },
                                }
                            )
                            .then(() => {
                                res.redirect('/findmatches')
                            })
                    } else {
                        const createChat = async (id, otherId) => {
                            try {
                                const lastChat = await dbObject
                                    .collection('chats')
                                    .findOne(
                                        {},
                                        { sort: { chatNumber: -1 }, limit: 1 }
                                    )
                                const chatNumber =
                                    lastChat === null
                                        ? 0
                                        : lastChat.chatNumber + 1
                                await dbObject.collection('chats').insertOne({
                                    chatNumber: chatNumber,
                                    users: [id, otherId],
                                    messages: [],
                                })
                                await dbObject.collection('users').updateOne(
                                    { _id: ObjectID(id) },
                                    {
                                        $push: {
                                            LikedProfiles: ObjectID(otherId),
                                        },
                                    }
                                )
                                res.redirect('/findmatches')
                            } catch (err) {
                                throw err
                            }
                        }

                        createChat(
                            mongo.ObjectID(loggedIn),
                            mongo.ObjectID(req.body.id)
                        )
                    }
                }
            })
    })
})

module.exports = router
