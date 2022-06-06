const express = require('express')
const bcrypt = require('bcrypt')
const {findUser, newUser} = require('../db/user')
const {newThought, findAllThoughts, findPublicThoughts, getThoughtByIdAndUser, thoughtById} = require('../db/thought')
const {newRate, findAllRates, getLastRate} = require('../db/rate')
const rateText = require('../db/rateText')
const encryption = require('../encryption/encrypt')
const { use } = require('bcrypt/promises')
const async = require('hbs/lib/async')

const router = new express.Router()

//login page
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
                req.session.save()
                console.log('session',req.session)
                res.render('newFeeling.hbs', {
                    username: req.session.username,
                    nickname: req.session.nickname,
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

//creating a new user
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

//saving the rate to the db, and encrypting it, sending decrypted data to client
router.post('/processEmotions', async (req, res) => {
    try{
        if(req.body.hiddenValue === ''){
            return res.render('newChoose.hbs', {message: 'יש לבחור לפחות רגש אחד שחשת היום או בזמן האחרון' })
        }
        const jsonObject = JSON.parse(req.body.hiddenValue)
        const keysArray = Object.keys(jsonObject)
        const feeling = keysArray.filter(key => jsonObject[key] === true)  
        if(feeling.length === 0){
            return res.render('newChoose.hbs', {message: 'יש לבחור לפחות רגש אחד שחשת היום או בזמן האחרון' })   
        }

        for(var i=0; i<feeling.length; i++){
            feeling[i] = new encryption().encrypt(feeling[i])
        }


        const rate = await newRate(req.session.username, req.session.emotion, feeling)
        await rate.save()
        const emotionality = req.session.emotion
        req.session.emotion = undefined         

        
        if(emotionality <= 2){
              res.render('emergency.hbs')
        }else{
            for(var i=0; i<feeling.length; i++){
                feeling[i] = new encryption().decrypt(feeling[i])
            }
            console.log(feeling)
            res.render('newHome.hbs', {username: req.session.username, nickname: req.session.nickname, emotionsPicked: (new rateText(feeling).get()), date: rate.date})
        }

    } catch(e){
        console.log(e)
    }
})

//choosing a range of feeling page
router.post('/range', async (req, res) => {
    const emotionality = req.body.emotion
    req.session.emotion = emotionality
    res.render('newChoose.hbs')
})


//POST /home -> uploading a thought
router.post('/home', async (req, res) => {
    try{
        //encrypt data if the thought is private
        if(req.body.chosen == 'private'){
            req.body.content = new encryption().encrypt(req.body.content)
            req.body.header = new encryption().encrypt(req.body.header)
        }
        const thought = await newThought(req.session.username, req.body.content, req.body.header, req.body.chosen).save()
        res.redirect('/home')
    } catch(e){
        console.log(e)
        res.render('newChoose.hbs', { message: 'יש לבחור לפחות רגש אחד שחשת היום או בזמן האחרון' })
    }
})

//like on a post 
router.post('/community/:id', async(req, res) => {
    const thought = await thoughtById(req.params.id)
    if(thought.likes.includes(req.session.username)){
        thought.likes = thought.likes.filter(item => item !== req.session.username)
    } else{
        thought.likes.push(req.session.username)
    }
    await thought.save()
    console.log(thought.likes)
    res.redirect('/community')
})


//edit thought page
router.post('/editPersonalThought/:id', async (req, res) => {
    const thoughtToUpdate = await thoughtById(req.params.id)
    thoughtToUpdate.privacy = req.body.chosen

    //encrypting the thought if it is private
    if(thoughtToUpdate.privacy == 'private'){
        thoughtToUpdate.content = new encryption().encrypt(req.body.content)
        thoughtToUpdate.header = new encryption().encrypt(req.body.header)
    } else{
        thoughtToUpdate.content = req.body.content
        thoughtToUpdate.header = req.body.header
    }
    
    await thoughtToUpdate.save()

    console.log(thoughtToUpdate)

    res.redirect('/home')
})


module.exports = router