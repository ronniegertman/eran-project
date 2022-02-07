module.exports = function isLoggedIn(req, res, next) {
    if(req.session.username || req.path === '/' || req.path === '/signin'){
       return next()
    }

    res.redirect('/')
}