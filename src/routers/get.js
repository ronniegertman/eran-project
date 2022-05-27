const express = require('express')
const {findUser, newUser} = require('../db/user')
const {newThought, findAllThoughts, findPublicThoughts, getThoughtByIdAndUser, getLastThought, thoughtById} = require('../db/thought')
const {newRate, findAllRates, getLastRate} = require('../db/rate')
const rateText = require('../db/rateText')
const async = require('hbs/lib/async')
const encryption = require('../encryption/encrypt')

const router = new express.Router()

router.get('/try', async (req, res) => {
    console.log( await thoughtById('6284cbc6c832b31701257548'))
    res.send(200)   
})

//viewing a thought page
router.get('/viewThought/:id', async (req, res) => {
    const thought = await thoughtById(req.params.id)
    res.render('viewDiary.hbs', { username: thought.username, header: thought.header, date: thought.date, content: thought.content })
})

//editing a thought page
router.get('/editPersonalThought/:id', async(req, res) => {
    //decrypting encryption on private thoughts
    const thought = await thoughtById(req.params.id)
    if(thought.privacy == 'private'){
        thought.header = new encryption().decrypt(thought.header)
        thought.content = new encryption().decrypt(thought.content)
    }
    let public, eran, private
    if(thought.privacy == 'public'){
        public = 'selected'
    } else if(thought.privacy == 'eran'){
        eran = 'selected'
    } else{
        private = 'selected'
    }
    res.render('editDiary.hbs', { id: thought._id, username: thought.username, header: thought.header, date: thought.date, content: thought.content, public, eran, private })
})

//login page 
router.get('/', (req, res) => {
    res.render('newLogin.hbs')
})

//sign up page
router.get('/signup', (req, res) => {
    res.render('newSignup.hbs', {})
})

//community page 
router.get('/community', async (req, res) => {
    try{
        const thoughts = await findAllThoughts(req.session.username)
        let personal = []
        for(var i=0; i<thoughts.length; i++){
             //decrypt thought header if it is private
            if(thoughts[i].privacy == 'private'){
                thoughts[i].header = new encryption().decrypt(thoughts[i].header)
            }
        }
        thoughts.forEach((thought, index) => { 
            personal.push({ 
                _id: thought._id,
                username: thought.username,
                header: thought.header,
                date: thought.date,
                odd: (index + 1) % 2 == 1,
                even: (index + 1) % 2 == 0
            })
        })
        const diaries = await findPublicThoughts()
        let public = []
        diaries.forEach((thought, index) => {
            public.push({
                _id: thought._id,
                username: thought.username,
                header: thought.header,
                date: thought.date,
                odd: (index + 1) % 2 == 1,
                even: (index + 1) % 2 == 0
            })
        })
        res.render('viewThoughts.hbs', { personal, public})
    } catch(e){
        console.log(e)
    }
})

//home page
router.get('/home', async(req, res) => {
    const lastRate = await getLastRate(req.session.username)
    if(lastRate === null){
        return res.render('newHome.hbs', {
            username: req.session.username,
            nickname: req.session.nickname,
            emotionsPicked: 'אין עדיין תחושות...',
            date: '16/02/2022'
        })
    }
    let array = lastRate.feelings
    for (var i=0; i<array.length; i++){
       array[i] = new encryption().decrypt(array[i]) 
    }
    res.render('newHome.hbs', {
        username: req.session.username,
        nickname: req.session.nickname,
        emotionsPicked: new rateText(lastRate.feelings).get(), 
        date: '16/02/2022'
    })
})

//all emotion rates of a user
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

//diary page
router.get('/diary', async(req, res) => {
    try{
        res.render('diary.hbs')
    } catch(e){
        console.log(e)
    }
})

//pulic thought sharing
router.get('/publicSharing', async(req, res) => {
    try{
        res.render('pubThought.hbs')
    } catch(e){
        console.log(e)
    }
})

//eran thought sharing
router.get('/eranSharing', (req, res) => {
    try{
        res.render('erThought.hbs')
    } catch(e){
        console.log(e)
    }
})

//private thought sharing
router.get('/privateSharing', (req, res) => {
    try{
        res.render('privThought.hbs')
    } catch(e){
        console.log(e)
    }
})

//emergency help page
router.get('/emergency', (req, res) => {
    res.render('emergency.hbs')
})

//error page (if user is looking for a page that does not exist)
router.get('*', (req, res) => {
    res.render('404.hbs')
})


module.exports = router