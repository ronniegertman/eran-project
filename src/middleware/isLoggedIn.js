module.exports = function isLoggedIn(req, res, next) {
    if((req.session.username && req.session.id) ||  req.path === '/' || req.path === '/signup' || req.path === '/io/kk'){
        return next()
    }

    res.redirect('/')
}