const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const myEnv = dotenv.config()
dotenvExpand(myEnv)

const methodOverride = require('method-override')
const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = 8000
const server = require('http').Server(app)
const multer = require('multer');

module.exports = {
    server,
    PORT,
}

// EJS setup
app.set('view engine', 'ejs')
// Set views folder
app.set('views', path.join(__dirname, 'views'))
// Use static files from public folder
app.use(express.static(__dirname + '/public'))
// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
// Use method Override - Source: https://dev.to/moz5691/method-override-for-put-and-delete-in-html-3fp2
app.use(methodOverride('_method'))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

require('./websocket.js')

// Set Routers
const rateLimitRoute = require('./routers/rateLimitRoute')
const regRoute = require('./routers/registerRoute')
const savedMatchesRoute = require('./routers/savedMatchesRoute')
const chatRoute = require('./routers/chatRoute')
const loginRoute = require('./routers/loginRoute')
const logOutRoute = require('./routers/logOutRoute')
const dislikeRoute = require('./routers/dislikeRoute')
const likeRoute = require('./routers/LikeRoute')
const editProfileRoute = require('./routers/editProfileRoute')
const profileRoute = require('./routers/profileRoute')
const findMatchRoute = require('./routers/findMatchRoute')


// require('./websocket')
app.use('/', rateLimitRoute)
app.use('/', savedMatchesRoute)
app.use('/', chatRoute)
app.use('/', loginRoute)
app.use('/', logOutRoute)
app.use('/', likeRoute)
app.use('/', dislikeRoute)
app.use('/', regRoute)
app.use('/', editProfileRoute)
app.use('/', profileRoute)
app.use('/', findMatchRoute)


// Error
app.use((req, res, next) => {
    res.status(404).render('pages/404_not_found', {
        title: 'ERROR404',
    })
})

// Express listens to PORT 8000
// app.listen(PORT, () => {
//     console.log(`http://localhost:${PORT}`)
// })
