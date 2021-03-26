const express = require('express')
const router = express.Router()
const slug = require('slug')
const mongo = require('mongodb')
const dateFormat = require('dateformat')
const ObjectID = mongo.ObjectID

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME
const ObjectId = mongo.ObjectID

dateFormat.masks.chatFormat = 'HH:MM - dd/mm'

db.initialize(dbName, (dbObject) => {
    router.get('/chats', async (req, res) => {
        try {
            const user = await dbObject
                .collection('users')
                .findOne({ _id: ObjectID(req.session.loggedInUser) })
            console.log(user)

            const chats = async (user) => {
                let chatList = []
                user.Chats.forEach((chat) => {
                    chatList.push(
                        dbObject
                            .collection('chats')
                            .findOne({ chatNumber: chat })
                    )
                })

                const allChats = await Promise.all(chatList)
                if (allChats.length > 0) {
                    for (let i = 0; i < allChats.length; i++) {
                        let userList = []
                        allChats[i].users.forEach((user) => {
                            userList.push(
                                dbObject
                                    .collection('users')
                                    .findOne({ _id: new ObjectId(user) })
                            )
                        })
                        allChats[i].users = await Promise.all(userList)
                    }
                    return allChats
                } else {
                    return []
                }
            }

            console.log(chats.allChats)

            res.render('pages/chats_overview', {
                title: 'chats',
                chats: chats,
                user: user,
            })
        } catch (err) {
            console.error(err)
        }
    })

    router.get('/chat/:id', async (req, res) => {
        try {
            const user = await dbObject
                .collection('users')
                .findOne({ _id: ObjectId(req.session.loggedInUser) })
            const id = parseInt(req.params.id)
            if (isNaN(id)) return res.sendStatus(400)
            const chat = await dbObject
                .collection('chats')
                .findOne({ chatNumber: id })
            const otherUserId =
                chat.users[0] == user._id ? chat.users[1] : chat.users[0]
            const otherUser = await dbObject
                .collection('users')
                .findOne({ _id: ObjectId(otherUserId) })
            const route = 'chats'
            res.render('pages/chat', {
                users: chat.users,
                messages: chat.messages,
                title: otherUser.Firstname,
                user,
                id,
                otherUser,
                route,
            })
        } catch (err) {
            console.log(err)
        }
    })

    router.post('/message', async (req, res) => {
        try {
            const user = req.body.userId
            const chat = req.body.chatId
            const message = req.body.message
            await dbObject.collection('chats').updateOne(
                { chatNumber: parseInt(chat) },
                {
                    $push: {
                        message: {
                            message: message,
                            userId: user,
                            date: dateFormat(new Date(), 'chatFormat'),
                        },
                    },
                }
            )
            res.redirect(`/chat/${req.body.chatId}`)
        } catch (err) {
            console.log(err)
        }
    })
})

module.exports = router
