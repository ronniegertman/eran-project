const express = require('express')
const {findUser, newUser} = require('../db/user')
const {newThought, findAllThoughts, findPublicThoughts, getThoughtByIdAndUser} = require('../db/thought')
const {newRate, findAllRates} = require('../db/rate')
const rateText = require('../db/rateText')

const router = new express.Router()

router.get('/', (req, res) => {
    res.render('login.hbs', {})
})


router.get('/signup', (req, res) => {
    res.render('signup.hbs', {})
})


router.get('/uploadNewThought', (req, res) => {
    res.render('uploadNewThought.hbs', {
        username: req.session.username,
        nickname: req.session.nickname
    })
})


router.get('/yourThoughts', async (req, res) => {
    try{
        const thoughts = await findAllThoughts(req.session.username)
        res.send(thoughts)
    } catch(e){
        console.log(e)
    }
})


router.get('/viewYourThoughts', async (req, res) => {
    try{
        const thoughtsArray = await findAllThoughts(req.session.username)
        if(thoughtsArray.length === 0){
            return res.render('viewYourThoughts.hbs', {
                username: req.session.username,
                nickname: req.session.nickname,
                message: 'There are no past thoughts created by this user',
                link: 'Upload a one here'
            })
        }
        res.render('viewYourThoughts.hbs', {
            username: req.session.username,
            nickname: req.session.nickname,
            message: 'Here are your personal thoughts'
        })
    } catch(e){
        res.send(e)
    }
})


router.get('/viewAllPublicThoughts', async (req, res) => {
    try{
        const thoughtsArray = await findPublicThoughts()
        if (thoughtsArray.length === 0){
            return res.render('viewAllThoughts.hbs', {
                username: req.session.username,
                message: 'Nobody has pulicly shared their thoughts yet',
                link: 'Upload a thought here'
            })
        }
        res.render('viewAllThoughts.hbs', {
            username: req.session.username,
            nickname: req.session.nickname,
            message: 'Here is what everybody is thinking about'
        })
    } catch(e){
        res.send('error')
    }
})


router.get('/editThought/:id', async (req, res) => {
    try{
        const thoughtToUpdate = await getThoughtByIdAndUser(req.params.id, req.session.username)
        console.log( 'update: ', thoughtToUpdate)
        req.session.thoughtToUpdate = req.params.id
        res.render('editThought.hbs', {
            header: thoughtToUpdate.header,
            content: thoughtToUpdate.content
        })
    } catch(e){
        res.send(e)
    }
})


router.get('/home', (req, res) => {
    res.render('home.hbs', {
        username: req.session.username,
        nickname: req.session.nickname,
        emotionsPicked: 'שמחה, שלווה', 
        date: '16/02/2022'
    })
})


router.get('/emotionRates', async (req, res) => {
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


router.get('/allPublicThoughts', async (req, res) => {
    try{
        const publicThoughts = await findPublicThoughts()
        res.send(publicThoughts)
    } catch(e) {
        console.log(e)
        res.status(500).send({ error: 'Something went wrong'})
    }
})


router.get('/emergency', (req, res) => {
    res.render('emergency.hbs')
})


router.get('/progress', (req, res) => {
    res.render('progress.hbs')
})


router.get('*', (req, res) => {
    res.render('404.hbs')
})


module.exports = router