const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const myEnv = dotenv.config()
dotenvExpand(myEnv)

const methodOverride = require('method-override');
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
// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
// Use method Override - Source: https://dev.to/moz5691/method-override-for-put-and-delete-in-html-3fp2
app.use(methodOverride('_method'));

// Set Routers
const mainRoute = require('./routers/mainRoute')
const savedMatchesRoute = require('./routers/saved_matches')
const chatRoute = require('./routers/chatRoute')

// require('./websocket')

app.use('/', mainRoute)
app.use('/', savedMatchesRoute)
app.use('/', chatRoute)

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
