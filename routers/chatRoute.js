const express = require('express')
const router = express.Router()
const slug = require('slug')
const mongo = require('mongodb')
const dateFormat = require('dateformat')
const ObjectID = mongo.ObjectID
const auth = require('../authentication/auth')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME
const ObjectId = mongo.ObjectID

dateFormat.masks.chatFormat = 'HH:MM - dd/mm'

db.initialize(dbName, (dbObject) => {
    router.get('/chat/:id', auth, async (req, res) => {
        try {
            const user = await dbObject
                .collection('users')
                .findOne({ _id: ObjectId(req.session.loggedInUser) })
            const id = parseInt(req.params.id)
            if (isNaN(id)) return res.sendStatus(400)
            const chat = await dbObject
                .collection('chats')
                .findOne({ chatNumber: id })
            let otherUserId
            console.log("jaja, daar is die dan:", chat.users)
            console.log("Lekker loggen!!", req.session.loggedInUser)
            const showUsername = () => {
                if (chat.users[0] == req.session.loggedInUser) {
                    otherUserId = chat.users[1] == user._id ? chat.users[0] : chat.users[1]
                    
                    console.log("1", otherUserId)
                    return
                } else {
                    otherUserId = chat.users[0] == user._id ? chat.users[1] : chat.users[0]
                    console.log("2", otherUserId)
                    return
                }
                
            }
            showUsername()
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
