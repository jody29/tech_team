const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')
const multer = require('multer')
const getAge = require('get-age')
const upload = multer({ dest: './public/images/profile'})
const fs = require('fs')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME

const bcrypt = require('bcrypt')
const { compare } = require('bcrypt')
const saltRounds = 10

const spotAPI = require('../public/scripts/convertMusic')
const { profile } = require('console')

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

        router.get('/photo', (req, res) => {
            var filename = req.params.id
             
            dbObject.collection('test').findOne({_id: mongo.ObjectId('605f655aeacd9e475b660296') }, (err, result) => {
                if (err) return console.log(err)
                res.contentType('image/jpeg')
                res.send(result.image.buffer)
              })
        })

        router.post(
            '/newProfileSubmit', upload.single('myfile'), 
            (req, res) => {
                let userProfile = req.body
                let pass1 = userProfile.Password
                let pass2 = userProfile.PasswordCheck
                
                if (pass1 !== pass2) {
                    res.render('pages/register', { message: "passwords do not match"})
                } else {
                    delete userProfile.PasswordCheck
                    let passwordHash = bcrypt.hashSync(
                        req.body.Password,
                        saltRounds
                    )
                    req.body.Password = passwordHash
                    
                    // calculate age with get age npm package
                    let Age = getAge(userProfile.Birthday)
                    userProfile['Age'] = Age
                    userProfile['LikedProfiles'] = []
                    userProfile['MatchedProfiles'] = []
                    userProfile.FavGenres = userProfile.FavGenres.map(name => name.toLowerCase())
                    let userSongs = userProfile.FavSongs

                    // Replace music with renderable spotify objects
                    const loopSongs = async (inputQuery) => {
                        userProfile.FavSongs = await spotAPI.inputLoop(inputQuery)
                    
                        const p = dbObject
                            .collection('users')
                            .insertOne(userProfile)

                        res.render('pages/login', {
                            title: 'Login Page',
                            message: 'Your account has been created! log in using the form below.'
                        })
                    }
                    if (req.file == undefined) {
                        let img = fs.readFileSync('./public/images/profile_placeholder.png')
                        let encode_image = img.toString('base64')
                    
                        // Define a JSONobject for the image attributes for saving to database
                        const finalImg = {
                            contentType: "image/png",
                            image:  new Buffer(encode_image, 'base64')
                        }
                        userProfile['image'] = finalImg
                        loopSongs(userSongs)
                    } else {
                        // Uploading file
                        let img = fs.readFileSync(req.file.path)
                        let encode_image = img.toString('base64')
                    
                        // Define a JSONobject for the image attributes for saving to database  
                        const finalImg = {
                        contentType: req.file.mimetype,
                        image:  new Buffer(encode_image, 'base64')
                        }
                        userProfile['image'] = finalImg
                        loopSongs(userSongs)
                    }
            }}
        )
    },
    (err) => {
        throw err
    }
)

module.exports = router
