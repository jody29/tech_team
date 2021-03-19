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

const spotAPI = require("../public/scripts/convertMusic");

router.get('/newprofile', (req, res) => {
    res.render('pages/register.ejs');
});

router.post('/newProfileSubmit', (req, res) => {
console.log(req.body);
let userProfile = req.body;
let userSongs = userProfile.FavSongs;
async function loopSongs(inputQuery) {
    userProfile.FavSongs = await spotAPI.inputLoop(inputQuery);
    console.log(userProfile);
    res.render("newHome.ejs", {data:userProfile});
}
loopSongs(userSongs);
});

db.initialize(
    dbName,
    collectionName,
    (dbCollection) => {
        
    (err) => {
        throw err
    }
});

module.exports = router;