const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require("mongodb")

// Database variables

const db = require('../connection/db')
const dbName = process.env.DB_NAME

const spotAPI = require("../public/scripts/convertMusic");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());



db.initialize(
    dbName,
    (dbObject) => {
        router.get('/newprofile', (req, res) => {
            res.render('pages/register.ejs');
        });
        
        router.post("/newProfileSubmit", (req, res) => {
            let userProfile = req.body;
            console.log(userProfile);
        
            let userSongs = userProfile.FavSongs;
            
            const loopSongs = async (inputQuery) => {
                userProfile.FavSongs = await spotAPI.inputLoop(inputQuery);
                
                console.log(userProfile);
                const p = dbObject.collection("users").insertOne(userProfile);
                res.render("pages/profile.ejs", {data:userProfile});
            }
            loopSongs(userSongs);
        });
    (err) => {
        throw err
    }
});

module.exports = router;