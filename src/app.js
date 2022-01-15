const path = require('path')
const fs = require('fs')


const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const req = require('express/lib/request')
const { compile } = require('hbs')



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


app.get('/', (req, res) => {
    res.render('login.hbs', {})
})

app.post('/welcome', (req, res) => {
    const username = req.body.username
    res.render('feeling.hbs',{username})
})

app.post('/range', (req, res) => {
    fs.writeFileSync(path.join(__dirname, 'feeling.json'), req.body.hiddenValue)
    res.render('range.hbs', {})
})

    

app.post('/processEmotions', (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, 'feeling.json'))
    const feelings = JSON.parse(data)
    const emotionality = req.body.emotion
    if(emotionality >= 8 && (feelings["cry"] || feelings["depressed"] || feelings["stressed"] || feelings["disappointed"])){
        const time = new Date().getHours()
        let message = ""
        if(2<= time && time < 8){
             message = "Eran is currently not availble via message/chat. Please call Eran 1201 or call 101"
        }else{
             message = "Please contact Eran via message/chat or a phone call to 1202"
        }
        res.render('emergency.hbs', { message })
    }else{
        res.render('home.hbs')
    }
})

app.get('*', (req, res) => {
    res.render('404.hbs',{
        name: 'Ronnie',
        title: 'Error 404', 
        message: 'Page not found'
    })
})


app.listen(port, () => {
    console.log('Server is up on port '+ port)
})