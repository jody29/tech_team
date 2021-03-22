const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require("mongodb")
const multer  = require('multer')
const upload = multer({ dest: 'images/profile' })
const getAge = require('get-age')
// Database variables

const db = require('../connection/db')
const dbName = process.env.DB_NAME

const spotAPI = require("../public/scripts/convertMusic");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let activeuserID;

db.initialize(
    dbName,
    (dbObject) => {
        router.get("/editprofile", (req, res) => {

            async function retrieveProfile() {

                console.log("pulling profile now")
                // function is searching for profiles based on the username of one of the database objects. This needs to be replaced.
                const pulledProfile = await dbObject
                        .collection('users')
                        .findOne({
                            _id: mongo.ObjectId(req.session.loggedInUser)
                        })
                console.log(pulledProfile);
                // set active user to update properly. This needs to be implimented with the session feature
                activeuserID = pulledProfile._id
                console.log(activeuserID)
                res.render('pages/edit_profile.ejs', ({ data: pulledProfile }));
            }
            retrieveProfile()
        });

        router.get("/deleteAccount", async (req, res) => {
            // Delete account based on the activeuserID
            const p = await dbObject.collection('users').deleteOne({ _id: mongo.ObjectId(activeuserID) });
            console.log("an account is being deleted")
            res.render("pages/register.ejs")
        });

        router.post("/saveAccount", (req, res) => {
            console.log("post recieved")
            // this var is the newly enterd data
            let loadingProfile = req.body;
            console.log(loadingProfile);
            // age gets calculated
            let Age = getAge(loadingProfile.Birthday);
            loadingProfile.Age = Age

            async function updateUser(newData) {

                let updatedSongs = loadingProfile.FavSongs
                // Drag songs through spotify API
                loadingProfile.FavSongs = await spotAPI.inputLoop(updatedSongs);
                console.log(loadingProfile)
                // getting the old profile
                const activeUser = await dbObject
                        .collection('users')
                        .findOne({
                            _id: mongo.ObjectId(activeuserID)
                        })
                console.log(activeUser);
                console.log("account wordt geupdate");
                // Profile will get updated with the new data.
                const p = await dbObject.collection('users').updateOne({ _id: mongo.ObjectId(activeuserID) }, { $set: newData });
                console.log("pulling profile now")
                // Pulling profile again to check
                const pulledProfile = await dbObject
                    .collection('users')
                    .findOne({
                        _id: mongo.ObjectId(activeuserID) 
                    })
                    console.log(pulledProfile);
                res.render("pages/profile.ejs", ({ data: pulledProfile}));
            }
            updateUser(loadingProfile)
        });
        
    (err) => {
        throw err
    }
});

module.exports = router;