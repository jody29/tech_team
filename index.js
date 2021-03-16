const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const myEnv = dotenv.config()
dotenvExpand(myEnv)

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 8000

// EJS setup
app.set('view engine', 'ejs')
// Set views folder
app.set('views', path.join(__dirname, 'views'))
// Use static files from public folder
app.use(express.static(__dirname + '/public'))

// Set Routers
const mainRoute = require('./routers/mainRoute')
const chatRoute = require('./routers/chatRoute')

app.use('/', mainRoute)
app.use('/', chatRoute)

// Express listens to PORT 8000
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
