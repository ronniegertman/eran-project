const express = require('express')
const bcrypt = require('bcrypt')
const {findUser, newUser} = require('../db/user')
const {newThought, findAllThoughts, findPublicThoughts, getThoughtByIdAndUser} = require('../db/thought')
const {newRate, findAllRates} = require('../db/rate')


const router = new express.Router()


router.post('/', async (req, res) => {
    try{
        const username = req.body.username
        const user = await findUser(username)
        if(user.length === 1){
            const password = req.body.password
            if(await bcrypt.compare(password, user[0].password)){
                const sessData = req.session
                sessData.username = username
                sessData.nickname = req.body.nickname
                res.render('feeling.hbs', {
                    username: req.session.username,
                    nickname: req.session.nickname
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


router.post('/signup', async (req, res) => {
    try{
        const username = req.body.username
        const user = await findUser(username)
        if(user.length === 0 && req.body.password === req.body.repeatedPassword){
            const hashedPassword = await bcrypt.hash(req.body.password, 8)
            const myUser = await newUser(req.body.username, hashedPassword, req.body.nickname)
            await myUser.save()
            res.render('login.hbs', {
                message: 'User created successfully, please log in'
            })
        }else if(req.body.password !== req.body.repeatedPassword){
            res.render('signup.hbs', {
                message: 'Passwords do not match'
            })
        }else{
            res.render('signup.hbs', {
                message: 'Username already exists'
            })
        }
    } catch(e){
        console.log(e)
    }
})


router.post('/range', async (req, res) => {
    const jsonObject = JSON.parse(req.body.hiddenValue)
    const keysArray = Object.keys(jsonObject)
    const feeling = keysArray.filter(key => jsonObject[key] === true)
    req.session.feelings = feeling
    // fs.writeFileSync(path.join(__dirname, 'feeling.json'), req.body.hiddenValue)
    res.render('range.hbs', {username: req.session.username, nickname: req.session.nickname})
})


router.post('/processEmotions', async (req, res) => {
    const emotionality = req.body.emotion
    try{
        const rate = await newRate(req.session.username, req.body.emotion, req.session.feelings)
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
        res.render('home.hbs', {username: req.session.username, nickname: req.session.nickname})
    }
})


//POST /home -> uploading a thought
router.post('/home', async (req, res) => {
    try{
        const thought = await newThought(req.session.username, req.body.content, req.body.header, req.body.chosen).save()
        console.log(thought)
        res.render('home.hbs', {
            username: req.session.username,
            nickname: req.session.nickname
        })
    } catch(e){
        console.log(e)
    }
})


router.post('/home/updated', async (req, res) => {
    const thoughtToUpdate = await getThoughtByIdAndUser(req.session.thoughtToUpdate, req.session.username)
    delete req.session.thoughtToUpdate
    thoughtToUpdate.header = req.body.header
    thoughtToUpdate.content = req.body.content
    thoughtToUpdate.privacy = req.body.chosen
    await thoughtToUpdate.save()

    res.send('200')
})


module.exports = router