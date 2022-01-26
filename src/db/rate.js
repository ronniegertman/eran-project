const mongoose = require('mongoose')
const printDate = require('./date')

mongoose.connect('mongodb://127.0.0.1:27017/Eran')

console.log('connect')


const Rate = mongoose.model('Rate', {
    username: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: String,
        default: new printDate(new Date()).get()
    },
    rate: {
        type: Number,
        required: true
    }
   
})

function newRate(username, rate) {
    return new Rate({username, rate})
    
}

function findAllRates(username) {
    return Rate.find({username})
}


module.exports = {
    newRate,
    findAllRates
}
