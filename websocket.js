const server = require('./index').server
const io = require('socket.io')(server)

const db = require('../connection/db')
const dbName = process.env.DB_NAME
const collectionUsers = 'users'
const collectionChat = 'chat'
