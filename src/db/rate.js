const mongoose = require('mongoose')
const printDate = require('./date')
mongoose.connect('mongodb+srv://ronniegertman:ronnie100@cluster0.qjuvq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

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
