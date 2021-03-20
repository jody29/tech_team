const express = require('express')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

// Database variables
const db = require('../connection/db')
const dbName = process.env.DB_NAME


module.exports = router
