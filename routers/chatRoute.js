const express = require('express')
const router = express.Router()

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME
const collectionName = 'users'

router.get('/chat', (req, res) => {
    res.render('pages/chat', {
        title: 'chats',
    })
})

module.exports = router
