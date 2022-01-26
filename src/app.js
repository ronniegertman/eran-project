const path = require('path')
const fs = require('fs')
const {findUser, newUser, checkPassword} = require('./db/user')
const {newThought, findAllThoughts} = require('./db/thought')
const {newRate, findAllRates} = require('./db/rate')


const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const { parse } = require('path')
const { use } = require('bcrypt/promises')
const async = require('hbs/lib/async')


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
app.use(require("express-session")({secret: 'hello'}))  //setting up sessions for users


//app.get()
app.get('/', (req, res) => {
    res.render('login.hbs', {})
})


app.get('/signin', (req, res) => {
    res.render('signin.hbs', {})
})


app.get('/uploadNewThought', (req, res) => {
    res.render('uploadNewThought.hbs', {
        username: req.session.username
    })
})


app.get('/yourThoughts', async (req, res) => {
    try{
        const thoughts = await findAllThoughts(req.session.username)
        res.send(thoughts)
    } catch(e){
        console.log(e)
    }
})


app.get('/viewYourThoughts', async (req, res) => {
    try{
        const thoughtsArray = await findAllThoughts(req.session.username)
        if(thoughtsArray.length === 0){
            return res.render('viewYourThoughts.hbs', {
                username: req.session.username,
                message: 'There are no past thoughts created by this user',
                link: 'Upload a one here'
            })
        }
        res.render('viewYourThoughts.hbs', {
            username: req.session.username,
            message: 'Here are your personal thoughts'
        })
    } catch(e){
        res.send(e)
    }
})


app.get('/home', (req, res) => {
    res.render('home.hbs', {
        username: req.session.username
    })
})


app.get('/emotionRates', async (req, res) => {
    try{
        const rates = await findAllRates(req.session.username)
        if(rates.length === 0){
            res.send({
                error: 'No rates found'
            })
        }else if(rates.length > 10){
            let array = []
            for(let i = (rates.length - 10); i < rates.length; i++){
                array.push(rates[i])
            }
            res.send(array)
        }else{
            res.send(rates)
        }
    } catch(e){
        console.log(e)
    }
})


//app.post()
app.post('/', async (req, res) => {
    try{
        const username = req.body.username
        const user = await findUser(username)
        if(user.length === 1){
            const password = req.body.password
            const resArray = await checkPassword(username, password)
            if(resArray.length === 1){
                const sessData = req.session;
                sessData.username = username;
                res.render('feeling.hbs', {
                    username: req.session.username
                })
            }else{
                res.render('login.hbs', {
                    message: 'Password is incorrect'
                })
            }
        }else{
            res.render('login.hbs', {
                messgae: 'User does not exist'
            })
        }
    } catch(e){
        console.log(e)
    }
})


app.post('/signin', async (req, res) => {
    try{
        const username = req.body.username
        const user = await findUser(username)
        if(user.length === 0 && req.body.password === req.body.repeatedPassword){
            // const hashedPassword = bcrypt.hash(req.body.password, 8)
            const myUser = await newUser(req.body.username, req.body.password, req.body.nickname)
            await myUser.save()
            res.render('login.hbs', {
                message: 'User created successfully, please log in'
            })
        }else if(req.body.password !== req.body.repeatedPassword){
            res.render('signin.hbs', {
                message: 'Passwords do not match'
            })
        }else{
            res.render('signin.hbs', {
                message: 'Username already exists'
            })
        }
    } catch(e){
        console.log(e)
    }
})


app.post('/range', (req, res) => {
    fs.writeFileSync(path.join(__dirname, 'feeling.json'), req.body.hiddenValue)
    res.render('range.hbs', {username: req.session.username})
})


app.post('/processEmotions', async (req, res) => {
    const emotionality = req.body.emotion
    try{
        const rate = await newRate(req.session.username, req.body.emotion)
        await rate.save()
    } catch(e){
        console.log(e)
    }
    if(emotionality <= 3){

        const time = new Date().getHours()
        let message = ""

        if(2<= time && time < 8){
             message = "Eran is currently not availble via message/chat. Please call Eran 1201 or call 101"
        }else{
             message = "Please contact Eran via message/chat or a phone call to 1202"
        }

        res.render('emergency.hbs', { message })
    }else{
        res.render('home.hbs', {username: req.session.username})
    }
})


app.post('/home', async (req, res) => {
    try{
        console.log('btn', req.body.chosen)
        const thought = await newThought(req.session.username, req.body.content, req.body.header).save()
        console.log(thought)
        res.render('home.hbs', {
            username: req.session.username
        })
    } catch(e){
        console.log(e)
    }
})


app.get('*', (req, res) => {
    res.render('404.hbs')
})



app.listen(port, () => {
    console.log('Server is up on port '+ port)
})