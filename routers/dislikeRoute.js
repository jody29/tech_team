const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const { ObjectID, MongoClient } = require('mongodb')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME
const collectionName = 'users'

//liking a profile
db.initialize(dbName, collectionName, (dbCollection) => {
    router.post('/like', async (req, res) => {
        try {
            const user = await dbCollection.findOne({
                _id: ObjectID(req.session.loggedInUser),
            })
            await dbCollection.findOneAndUpdate(
                { _id: ObjectID(req.session.loggedInUser) },
                { $pull: { LikedProfiles: req.body.id } }
            )
        } catch (err) {
            console.log(err)
        }
    })
})

module.exports = router
