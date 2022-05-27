const express = require('express')
const bcrypt = require('bcrypt')
const {findUser, newUser} = require('../db/user')
const {newThought, findAllThoughts, findPublicThoughts, getThoughtByIdAndUser, thoughtById} = require('../db/thought')
const {newRate, findAllRates} = require('../db/rate')
const rateText = require('../db/rateText')
const {generate, encrypt, decrypt} = require('../encryption/encrypt')
const { use } = require('bcrypt/promises')

const router = new express.Router()

//login page
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
                // sessData.object = generate() //generating encryption keys
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
        // feeling.forEach(feeling => encrypt(feeling, req.session.object))    
        if(feeling.length === 0){
            return res.render('newChoose.hbs', {message: 'יש לבחור לפחות רגש אחד שחשת היום או בזמן האחרון' })   
        }
        const rate = await newRate(req.session.username, req.session.emotion, feeling)
        await rate.save()
        const emotionality = req.session.emotion
        req.session.emotion = undefined

        if(emotionality <= 2){
              res.render('emergency.hbs', { message })
        }else{
            // const feelArray = feeling.forEach(feeling => decrypt(feeling, req.session.object))
            res.render('newHome.hbs', {username: req.session.username, nickname: req.session.nickname, emotionsPicked: new rateText(feeling).get(), date: rate.date})
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
        // if(req.body.chosen == 'private'){
        //     req.body.content = encrypt(req.body.content, req.session.object)
        //     req.body.header = encrypt(req.body.header, req.session.object)
        // }
        const thought = await newThought(req.session.username, req.body.content, req.body.header, req.body.chosen).save()
        console.log( await thoughtById(thought._id))
        res.render('newHome.hbs', {
            username: req.session.username,
            nickname: req.session.nickname
        })
    } catch(e){
        res.render('newChoose.hbs', { message: 'יש לבחור לפחות רגש אחד שחשת היום או בזמן האחרון' })
    }
})

//edit thought page
router.post('/editPersonalThought/:id', async (req, res) => {
    const thoughtToUpdate = await thoughtById(req.params.id)
    thoughtToUpdate.privacy = req.body.chosen

    //encrypting the thought if it is private
    // if(thoughtToUpdate.privacy == 'private'){
    //     thoughtToUpdate.content = encrypt(req.body.content, req.session.object)
    //     thoughtToUpdate.header = encrypt(req.body.header, req.session.object)
    // } else{
        thoughtToUpdate.content = req.body.content
        thoughtToUpdate.header = req.body.header
    // }
    
    await thoughtToUpdate.save()

    console.log(thoughtToUpdate)

    res.redirect('/home')
})


module.exports = router