const path = require('path')
const fs = require('fs')
const {findUser, newUser, checkPassword} = require('./db/user')
const {newThought, findAllThoughts} = require('./db/thought')


const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const { use } = require('express/lib/application')
const req = require('express/lib/request')


const app = express()
const port = process.env.PORT || 3000


//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname, '../templates/partials'))


//Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')) )
app.use( bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }))
app.use(express.json())

//handle users
let currentUser

//app.get()
app.get('/', (req, res) => {
    res.render('login.hbs', {})
})


app.get('/signin', (req, res) => {
    res.render('signin.hbs', {})
})


app.get('/uploadNewThought', (req, res) => {
    res.render('uploadNewThought.hbs', {
        username: currentUser
    })
})


app.get('/viewYourThoughts', (req, res) => {
    findAllThoughts(currentUser).then(thoughtsArray => {
        if(thoughtsArray.length === 0){
            return res.render('viewYourThoughts.hbs', {
                username: currentUser,
                message: 'There are no past thoughts made by this user. upload a new one from ',
                link:'here',
                thoughts: []
            })
        }
    
        res.render('viewYourThoughts.hbs', {
            username: currentUser,
            message: 'here are your thoughts',
            thoughts: thoughtsArray
        })
    }).catch(err => {
        res.send(err)
    })

    
   
})


//app.post()
app.post('/', (req, res) => {
    const username = req.body.username
    const user = findUser(username)
    user.then((result) => {
        if( result.length === 1 ){
            const password = req.body.password
            checkPassword(username, password).then(resArr => {
                if(resArr.length === 1){
                    currentUser = username
                    res.render('feeling.hbs',{ username: currentUser })
                }else{
                    res.render('login.hbs', {
                        message: 'Password is incorrect'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        }else{
            res.render('login.hbs', {
                message: 'User does not exist'
            })
        }
    }).catch((error) => {
        console.log(error)
    })
    
})


app.post('/signin', (req, res) => {
    const username = req.body.username
    const user = findUser(username)
    
    user.then((result1) => {
        if( result1.length === 0 && req.body.password === req.body.repeatedPassword){
            const myUser = newUser(req.body.username, req.body.password, req.body.nickname).save()
            myUser.then((result2) => {
                console.log(result2)
                res.render('login.hbs', {
                    message: 'User created successfully, please log in'
                })

            }).catch((err) => {
                console.log(err)
            })

        }else if(req.body.password !== req.body.repeatedPassword){
            res.render('signin.hbs', {
                message: "Passwords don't match"
            })
        }else{
            res.render('signin.hbs', {
                message: "User already exists"
            })
        }
    }).catch((error) => {
        console.log(error)
    })
})


app.post('/range', (req, res) => {
    fs.writeFileSync(path.join(__dirname, 'feeling.json'), req.body.hiddenValue)
    res.render('range.hbs', {username: currentUser})
})


app.post('/processEmotions', (req, res) => {
    const emotionality = req.body.emotion

    if(emotionality >= 8){

        const time = new Date().getHours()
        let message = ""

        if(2<= time && time < 8){
             message = "Eran is currently not availble via message/chat. Please call Eran 1201 or call 101"
        }else{
             message = "Please contact Eran via message/chat or a phone call to 1202"
        }

        res.render('emergency.hbs', { message })
    }else{
        res.render('home.hbs', {username: currentUser})
    }
})


app.post('/home', (req, res) => {
    newThought(currentUser, req.body.content, req.body.header).save().then((result) => {
        console.log( 'result ' , result)
    }).catch(err => {
        console.catch(err)
    })
    res.render('home.hbs', {username: currentUser})
})


app.get('*', (req, res) => {
    res.render('404.hbs')
})



app.listen(port, () => {
    console.log('Server is up on port '+ port)
})