const express = require('express')
const router = express.Router()
const slug = require('slug')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME
const collectionName = 'users'

router.get('/chat', async (req, res) => {
    try {
        res.render('pages/chat', {
            title: 'chats',
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
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
