module.exports = function isLoggedIn(req, res, next) {
    if((req.session.username && req.session.id) ||  req.path === '/viewThought/:id' ||req.path === '/' || req.path === '/signup' || req.path === '/try'){
       return next()
    }

    res.redirect('/')
}