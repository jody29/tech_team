const express = require('express')
const process = require('process')

const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const path = require('path')

const port = process.env.PORT || 8080

//const router = require("./router/route.js")

const db = require('./conecction/db')

const dbName = process.env.DB_NAME
const collectionName = process.env.COLLECTION_NAME

// EJS setup
app.set('view engine', 'ejs')
// Set views folder
app.set('views', path.join(__dirname, 'views'))
// Use static files from public folder
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
