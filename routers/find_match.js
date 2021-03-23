const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb')

//const ObjectID = mongo.ObjectID

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME

db.initialize(dbName, (dbObject) => {
    router.get('/findmatches', (req, res) => {
        let loggedUser = req.session.loggedInUser
        let loggedIn = loggedUser.toString()
        dbObject
            .collection('users')
            .findOne({ _id: mongo.ObjectId(loggedIn) }) //id van 'ingelogde persoon'
            .then((results) => {
                let favGenres = results.FavGenres
                let foundGenres = []
                return favGenres
                return foundGenres
                console.log('let favGenres is: ', favGenres)
                console.log('let found genres is:', foundGenres)
            })

            // dbObject
            //     .collection('users')
            .find()
            .toArray()
            .then((results) => {
                console.log('logged user is: ', loggedIn)
                const allUsersfavGenres = results.map((genres) => {
                    return genres.FavGenres
                })
                const filterMyGenreWithOtherUsers = allUsersfavGenres.filter(
                    (el) => favGenres.includes(el)
                )

                //})

                // const filterFavG = favG.map(item)
                console.log('all Users fav Genres is: ', allUsersfavGenres)
                console.log(
                    'filter my genre with others is: ',
                    filterMyGenreWithOtherUsers
                )
                res.render('pages/find_matches', {
                    data: results,
                    title: 'All matches',
                })
            })
    })
})

// async function getGenresProfile(favGenres) {
//     for (i = 0; i < favGenres.length; i++) {
//         console.log('dit is mijn itje', i)
//         const pullProfile = await dbObject
//             .collection('users')
//             .findOne({
//                 FavGenres: favGenres[i],
//             })
//         console.log('fac genres itje : ', favGenres[i])
//         console.log('pull profile: ', pullProfile)
//         foundGenres.push(pullProfile)
//         console.log('mijn gevonden genres', foundGenres)
//     }

// async function getGenresProfile(favGenres) {
//     for (i = 0; i < favGenres.length; i++) {
//         console.log('dit is mijn itje', i)
//         const pullProfile = await dbObject
//             .collection('users')
//             .find({}, { FavGenres: foundGenres })
//         //.find({ FavGenres: favGenres[i] })
//         console.log('pull profile: ', pullProfile)
//         //         .toArray((err, res) => {
//         //             console.log('fac genres itje : ', favGenres[i])
//         //             console.log('pull profile: ', pullProfile)

//         //             console.log('mijn gevonden genres', foundGenres)
//         //         })
//         foundGenres.push(pullProfile)
//     }

// Render saved_matches with filtered array
// res.render('pages/find_matches', {
//     data: foundGenres,
//     title: 'Find matches',
// })
//})
//}
//getGenresProfile(favGenres)
//         })
// })

//     dbObject
//         .collection('users')
//         .find()
//         .toArray()
//         .then((results) => {
//             console.log('logged user is: ', loggedIn)

//             const favG = results.map((genres) => {
//                 return genres.FavGenres
//             })
//             // const filterFavG = favG.map(item)
//             console.log('favG is: ', favG)
//             res.render('pages/find_matches', {
//                 data: results,
//                 title: 'All matches',
//             })
//         })
//     })
// })

module.exports = router
