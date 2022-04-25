const express = require('express')
const bcrypt = require('bcrypt')
const {findUser, newUser} = require('../db/user')
const {newThought, findAllThoughts, findPublicThoughts, getThoughtByIdAndUser} = require('../db/thought')
const {newRate, findAllRates} = require('../db/rate')
const rateText = require('../db/rateText')
const encrypt = require('../encryption/encrypt')
const { use } = require('bcrypt/promises')

const router = new express.Router()


router.post('/', async (req, res) => {
    try{
        const username = req.body.username
        const user = await findUser(username)
        const id = user._id
        if(user.length === 1){
            const password = req.body.password
            if(await bcrypt.compare(password, user[0].password)){
                const sessData = req.session
                sessData.username = username
                sessData.nickname = req.body.nickname
                sessData.id = id
                res.render('newFeeling.hbs', {
                    username: req.session.username,
                    nickname: req.session.nickname,
                    publicKey: user[0].publicKey,
                    privateKey: user[0].privateKey
                })
            }else{
                res.render('newLogin.hbs', {
                    message: 'Password is incorrect'
                })
            }
        }else{
            res.render('newLogin.hbs', {
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
            const myUser = await newUser(req.body.username, hashedPassword)
            console.log(myUser)
            await myUser.save()
            console.log('User created successfully, please log in')
            res.render('newLogin.hbs', {
                message: 'User created successfully, please log in'
            })
        }else if(req.body.password !== req.body.repeatedPassword){
            console.log('Passwords do not match')
            res.render('newSignup.hbs', {
                message: 'Passwords do not match'
            })
        }else{
            console.log('Username already exists')
            res.render('newSignup.hbs', {
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
    res.render('range.hbs', {username: req.session.username, nickname: req.session.nickname})
})


router.post('/processEmotions', async (req, res) => {
    const emotionality = req.body.emotion
    try{
        const rate = await newRate(req.session.username, req.body.emotion, req.session.feelings)
        await rate.save()
        req.session.feelings = undefined
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
            res.render('home.hbs', {username: req.session.username, nickname: req.session.nickname, emotionsPicked: new rateText(rate.feelings).get(), date: rate.date})
        }

    } catch(e){
        console.log(e)
    }
})


//POST /home -> uploading a thought
router.post('/home', async (req, res) => {
    try{
        // const encryptContent = new encrypt().encrypt(req.body.content)
        // const encryptHeader = new encrypt().encrypt(req.body.header)
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