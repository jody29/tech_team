const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require("mongodb")

// Database variables

const db = require('../connection/db')
const dbName = process.env.DB_NAME
const collectionName = 'users'

db.initialize(
    dbName,
    collectionName,
    (dbCollection) => {
        router.get('/newprofile', (req, res) => {
            res.render('pages/register.ejs');
        });
       router.post("/newProfileSubmit", (res, req) => {

       }),
    (err) => {
        throw err
    }
});

module.exports = router;