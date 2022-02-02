const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.redirect('/')
  }

  jwt.verify(token, 'ronnie', (err, user) => {
    console.log(err)

    if (err) return res.redirect('/')

    req.user = user

    next()
  })
}


function generateAccessToken(username) {
    return jwt.sign(username, 'ronnie');
  }


module.exports = { authenticateToken, generateAccessToken }