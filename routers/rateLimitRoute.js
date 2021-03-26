const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const { ObjectID, MongoClient } = require('mongodb')


const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 3, // limit is 3, so at the 4th request it will block
    onLimitReached: (req, res, options) => {
        res.render('pages/login', {
            title: 'Login Page',
            message: 'You have sent too manny wrong requests. Please try again in 3 minutes.',
        })
      },
    handler: (req, res, options) => {
        res.render('pages/login', {
            title: 'Login Page',
            message: 'Please try again in 3 minutes.',
        })
      },
  });


  router.use('/login',limiter);

  module.exports = router
