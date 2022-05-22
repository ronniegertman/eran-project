const express = require('express')
const {findUser, newUser} = require('../db/user')
const {newThought, findAllThoughts, findPublicThoughts, getThoughtByIdAndUser, getLastThought, thoughtById} = require('../db/thought')
const {newRate, findAllRates, getLastRate} = require('../db/rate')
const rateText = require('../db/rateText')
const async = require('hbs/lib/async')
// const encrypt = require('../encryption/encrypt')

const router = new express.Router()

router.get('/try', (req, res) => {

    res.render('viewDiary.hbs', { username: 'רוני', header: 'יום חדש', date: 'Mon 12n dj', content: 'הרבה דברים יש לי להגדדדדמללמ'}
    )
})


router.get('/viewThought/:id', async (req, res) => {
    const thought = await thoughtById(req.params.id)
    res.render('viewDiary.hbs', { username: thought.username, header: thought.header, date: thought.date, content: thought.content })
})


router.get('/', (req, res) => {
    res.render('newLogin.hbs')
})


router.get('/signup', (req, res) => {
    res.render('newSignup.hbs', {})
})


router.get('/uploadNewThought', (req, res) => {
    res.render('uploadNewThought.hbs', {
        username: req.session.username,
        nickname: req.session.nickname
    })
})


router.get('/community', async (req, res) => {
    try{
        const thoughts = await findAllThoughts(req.session.username)
        let personal = []
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
        console.log(diaries)
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

        console.log(diaries)
        res.render('viewThoughts.hbs', { personal, public})
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

router.get('/home/viewYourThoughts', async(req, res) => {
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
                message: 'Nobody has publicly shared their thoughts yet',
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

    res.render('newHome.hbs', {
        username: req.session.username,
        nickname: req.session.nickname,
        emotionsPicked: new rateText(lastRate.feelings).get(), 
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

router.get('/diary', async(req, res) => {
    try{
        res.render('diary.hbs')
    } catch(e){
        console.log(e)
    }
})

router.get('/publicSharing', async(req, res) => {
    try{
        res.render('pubThought.hbs')
    } catch(e){
        console.log(e)
    }
})

router.get('/eranSharing', (req, res) => {
    try{
        res.render('erThought.hbs')
    } catch(e){
        console.log(e)
    }
})

router.get('/privateSharing', (req, res) => {
    try{
        res.render('privThought.hbs')
    } catch(e){
        console.log(e)
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