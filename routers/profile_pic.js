// const express = require('express')
// const router = express.Router()
// const path = require('path')
// const bodyParser = require('body-parser')
// const session = require('express-session')
// const mongo = require('mongodb')
// const chatService = require('../services/chatService')
// const multer = require('multer')
// const fs = require('fs')


// // Database variables
// const db = require('../connection/db')
// const dbName = process.env.DB_NAME

// router.use(bodyParser.urlencoded({ extended: true }))



// db.initialize(
//     dbName,
//     (dbObject) => {
        

//         router.post('/newProfileSubmit', upload.single('picture'), (req, res) => {
//             var img = fs.readFileSync(req.file.path);
//             var encode_image = img.toString('base64');
//          // Define a JSONobject for the image attributes for saving to database
          
//             var profileImage = {
//               contentType: req.file.mimetype,
//               image:  new Buffer(encode_image, 'base64')
//            };
//         dbObject.collection('users').insertOne(profileImage, (err, result) => {
//             console.log(result)
         
//             if (err) return console.log(err)
         
//             console.log('saved to database')
//             res.redirect('/')
           
             
//           })
//         })
        
//     },
//     (err) => {
//         throw err
//     }
// )

// module.exports = router