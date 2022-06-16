const path = require('path')
const isLoggedIn = require('./middleware/isLoggedIn')
const getRouter = require('./routers/get')
const postRouter = require('./routers/post')
const { getLastRate } = require('./db/rate')
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
      

      const badFeelingsRec = require('./utils/feelingObject')

      for(var i=0; i<lastRate.feelings.length; i++){

        const value = badFeelingsRec[lastRate.feelings[i]]
        console.log('value', value)
        console.log(lastRate.feelings[i])
        if(value){
          io.emit('welcome', 'מצאתי המלצה שתשפר את רגש ה'+ lastRate.feelings[i])
          io.emit('link', value)
        }

      }
    }else{
      io.emit('welcome', 'לא מצאתי תחושות שהזנת במערכת...')
      io.emit('welcome', 'מהן התחושות שלך?')
    }
    
}
    , 2000 )
 

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
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