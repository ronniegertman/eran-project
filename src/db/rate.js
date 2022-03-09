const mongoose = require('mongoose')
const printDate = require('./date')
mongoose.connect(process.env.MONGODB_URL)

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

function getLastRate(username){
    return Rate.findOne({username}, {}, {
        sort: {
            createdAt: -1
        }
    })
}


module.exports = {
    newRate,
    findAllRates,
    getLastRate
}
