module.exports = function isLoggedIn(req, res, next) {
    if((req.session.username && req.session.id) ||  req.path === '/' || req.path === '/signup'){
        return next()
    }

    res.redirect('/')
}