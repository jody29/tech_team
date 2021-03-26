const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')
const multer = require('multer')
const getAge = require('get-age')
const upload = multer({ dest: 'images/profile' })

// Database variables

const db = require('../connection/db')
const dbName = process.env.DB_NAME

const bcrypt = require('bcrypt')
const { compare } = require('bcrypt')
const saltRounds = 10

const spotAPI = require('../public/scripts/convertMusic')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

db.initialize(
    dbName,
    (dbObject) => {
        router.get('/newprofile', (req, res) => {
            res.render('pages/register.ejs', {
                title: 'Register',
                message: '',
            })
        })

        router.post(
            '/newProfileSubmit',
            upload.single('profileImage'),
            (req, res) => {
                // Getting user profile
                let userProfile = req.body

                let pass1 = userProfile.Password
                let pass2 = userProfile.PasswordCheck
                console.log(pass1)
                console.log(pass2)
                if (pass1 !== pass2) {
                    console.log('incorrect password')
                    res.render('pages/register', {
                        message: 'passwords do not match',
                    })
                } else {
                    delete userProfile.PasswordCheck
                    let passwordHash = bcrypt.hashSync(
                        req.body.Password,
                        saltRounds
                    )
                    req.body.Password = passwordHash
                    console.log(userProfile)

                    // calculate age with get age npm package
                    let Age = getAge(userProfile.Birthday)
                    userProfile['Age'] = Age
                    userProfile['LikedProfiles'] = []

                    let userSongs = userProfile.FavSongs
                    // Replace music with renderable spotify objects
                    const loopSongs = async (inputQuery) => {
                        userProfile.FavSongs = await spotAPI.inputLoop(
                            inputQuery
                        )
                        //push data to database
                        const p = dbObject
                            .collection('users')
                            .insertOne(userProfile)
                        res.redirect('/')
                    }

                    loopSongs(userSongs)
                }
            }
        )
    },
    (err) => {
        throw err
    }
)

module.exports = router
