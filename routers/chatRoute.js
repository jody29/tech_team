const express = require('express')
const router = express.Router()
const slug = require('slug')
const chatService = require('../services/chatService')
const mongo = require('mongodb')
const dateFormat = require('dateformat')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME
const ObjectId = mongo.ObjectID

dateFormat.masks.chatFormat = 'HH:MM - dd/mm'

db.initialize(dbName, (dbObject) => {
    router.get('/chat/:id', async (req, res) => {
        try {
            const user = await dbObject
                .collection('users')
                .findOne({ _id: ObjectId(req.session.currentUser) })
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
            const user = slug(req.body.userId)
            const chat = slug(req.body.chatId)
            const message = slug(req.body.message)
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
        } catch (err) {
            console.log(err)
        }
    })
})

module.exports = router
