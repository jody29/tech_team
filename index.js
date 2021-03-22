const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const myEnv = dotenv.config()
dotenvExpand(myEnv)

const methodOverride = require('method-override');
const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const path = require('path')
const PORT = process.env.PORT || 8000

// EJS setup
app.set('view engine', 'ejs')
// Set views folder
app.set('views', path.join(__dirname, 'views'))
// Use static files from public folder
app.use(express.static(__dirname + '/public'))
// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
// Use method Override - Source: https://dev.to/moz5691/method-override-for-put-and-delete-in-html-3fp2
app.use(methodOverride('_method'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
)

// Set Routers
const mainRoute = require('./routers/mainRoute')
const regRoute = require('./routers/register_route')
const savedMatchesRoute = require('./routers/saved_matches')
const chatRoute = require('./routers/chatRoute')
const loginRoute = require('./routers/loginRoute')
const logOutRoute = require('./routers/logOUtRoute')
const dislikeRoute = require('./routers/dislikeRoute')
const likeRoute = require('./routers/LikeRoute')
const editProfileRoute = require('./routers/edit_profile')
const profileRoute = require('./routers/profileRoute')

// require('./websocket')

app.use('/', mainRoute)
app.use('/', savedMatchesRoute)
app.use('/', chatRoute)
app.use('/', loginRoute)
app.use('/', logOutRoute)
app.use('/', likeRoute)
app.use('/', dislikeRoute)
app.use('/', regRoute)
app.use('/', editProfileRoute)
app.use('/', profileRoute)

// Error
app.use((req, res, next) => {
    res.status(404).render('pages/404_not_found', {
        title: 'ERROR404',
    })
})


// Express listens to PORT 8000
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
