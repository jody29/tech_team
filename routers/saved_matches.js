const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME
const collectionName = 'users'

db.initialize(
    dbName,
    collectionName,
    (dbCollection) => {
        router.get('/savedmatches', (req, res) => {
            dbCollection
                .find()
                .toArray()
                .then((results) => {
                    res.render('pages/saved_matches', {
                        data: results,
                        title: 'Saved matches',
                    })
                })
        })

        router.delete('/savedmatches', (req, res) => {
            console.log('DELETE1')
            dbCollection
                .deleteOne({ _id: mongo.ObjectId(req.body.userId) })
                .then(() => {
                    res.redirect('/savedmatch')
                })
        })
    },
    (err) => {
        throw err
    }
)

module.exports = router
