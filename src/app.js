const path = require('path')
const isLoggedIn = require('./middleware/isLoggedIn')
const getRouter = require('./routers/get')
const postRouter = require('./routers/post')

const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')


const app = express()
const port = process.env.PORT || 3000


//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))


//Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')) )
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }))
app.use(express.json())
app.use(require("express-session")({secret: process.env.EXPRESS_SESSION_SECRET}))  //setting up sessions for users
app.use(isLoggedIn)


//app.get()
app.use(getRouter)

//app.post()
app.use(postRouter)


app.listen(port, () => {
    console.log('Server is up on port '+ port)
})