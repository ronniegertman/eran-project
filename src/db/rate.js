const mongoose = require('mongoose')
const printDate = require('./date')
mongoose.connect('mongodb://127.0.0.1:27017/Eran')

console.log('connect')

const schema = new mongoose.Schema({
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
    }, feelings: {
        type: Array,
        default: []
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})

// schema.pre('save', function(next){
//     const rate = this
//     if(rate.isModified('rate')){
//         const rate = new rateText(rate.feelings)
//     } next()
// })

const Rate = mongoose.model('Rate', schema)


function newRate(username, rate, feelings) {
    return new Rate({username, rate, feelings})
    
}

function findAllRates(username) {
    return Rate.find({username})
}


module.exports = {
    newRate,
    findAllRates
}
