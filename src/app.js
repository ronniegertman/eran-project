const path = require('path')
const isLoggedIn = require('./middleware/isLoggedIn')
const getRouter = require('./routers/get')
const postRouter = require('./routers/post')
const { getLastRate } = require('./db/rate')
const { isFeeling, getFeelings } = require('./utils/functions')
const badFeelingsRec = require('./utils/feelingObject')
const encryption = require('./encryption/encrypt')
const http = require('http')
const socketio = require('socket.io')


const express = require('express')
const hbs = require('hbs')
const bodyParser = require('body-parser')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
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
app.use(require("express-session")({secret: 'cxkzjvnjkxzcvjnxcvjnjncxz'}))  //setting up sessions for users
app.use(isLoggedIn)

app.get('/io/:username', (req, res) => {

  console.log('here')
  //checking access 
  if(req.params.username === req.session.username)
  {
    return res.render('try.hbs')
  }
  res.redirect('/home')
    
})

io.on('connection', (socket) => {
  let userId = ''
  socket.on('id', (id, callback) => {
    userId = id
    console.log(userId, 'userId')
    callback('ok')
  })

  io.emit('welcome', 'שלום, אני הבוט של ERANITY' )
  io.emit('welcome', 'אני קורא את המחשבות שסימנת ומציע המלצות בהתאם')
  setTimeout(async () => { 
    const lastRate = await getLastRate(userId)
    if(lastRate){

      for(var i=0; i< lastRate.feelings.length; i++){
        lastRate.feelings[i] = new encryption().decrypt(lastRate.feelings[i])
      }
      
      io.emit('welcome', 'הרגשות האחרונים שהרגשת הם: '+ lastRate.feelings)
      

      for(var i=0; i<lastRate.feelings.length; i++){

        const value = badFeelingsRec[lastRate.feelings[i]]
        
        if(value){
          io.emit('welcome', 'מצאתי המלצה שתשפר את רגש ה'+ lastRate.feelings[i])
          io.emit('link', value)
        }

      }
      setTimeout(() => {
        io.emit('welcome', 'האם ההמלצות שלי עזרו לך? (כן/לא)  ')
      }, 2000)
      
    }else{
      io.emit('welcome', 'לא מצאתי תחושות שהזנת במערכת...')
      io.emit('welcome', 'מהן התחושות שלך?')
    }
    
}
    , 2000 )
 

  socket.on('chat message', (msg) => {
    if(msg === 'כן'){
      io.emit('chat message', msg);
      setTimeout(() => {
        io.emit('welcome', 'איזה יופי! אני שמח שהצלחתי לעזור :) ')
        io.emit('welcome', 'תודה שהשתמשת בבוט של ERANITY')
      }, 1000)
      
    } else if(msg === 'לא'){
      io.emit('chat message', msg)
      setTimeout(() => {
        io.emit('welcome', 'איזה באסה... כדאי לפנות לקבלת עזרה')
        io.emit('eran-link', '/emergency')
      }, 1000)
    } else if(isFeeling(msg)) {
        io.emit('chat message', msg)
        console.log('here')
        const feelings = getFeelings(msg)
        console.log(feelings)
        for(var i=0; i<feelings.length; i++){

          const value = badFeelingsRec[feelings[i]]
          
          if(value){
            io.emit('welcome', 'מצאתי המלצה שתשפר את רגש ה'+ feelings[i])
            io.emit('link', value)
          }
        }
        io.emit('welcome', 'תודה על השימוש בבוט ERANITY')
        
    } else{
      io.emit('chat message', msg)
      io.emit('welcome', 'לא הצלחתי להבין את התחושות שלך... אני מפנה אותך לקבלת עזרה')
      io.emit('welcome', 'תודה על השימוש שלך בבוט ERANITY')
      io.emit('eran-link', '/emergency')

    }
    
  });

  socket.on('disconnect', () => {
    console.log('user disconneted')
  })
});

//app.get()
app.use(getRouter)

//app.post()
app.use(postRouter)





server.listen(port, () => {
    console.log('Server is up on port '+ port)
})