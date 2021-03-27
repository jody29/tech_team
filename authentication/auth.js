const isAuthenticated = (req, res, next) => {
    if (req.session.loggedInUser != undefined) return next()
    res.redirect('/')
}

module.exports = isAuthenticated
