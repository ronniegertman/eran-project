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
    header: {
        type: String,
        trim: true,
        default: 'New Thought'
    },
    content: {
        type: String,
        required: true
    }, 
    date: {
        type: String,
        default: new printDate(new Date()).get()
    }, 
    privacy: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})

const Thought = mongoose.model('Thought', schema)

function newThought(username, content, header, privacy) {
    return new Thought({username, content, header, privacy})
    
}

function findAllThoughts(username) {
    return Thought.find({username})
}

function findPublicThoughts(){
    return Thought.find({privacy: 'public'})
}

function getThoughtByIdAndUser(id, username) {
    return Thought.findOne({ _id: id, username })
}


module.exports = {
    newThought,
    findAllThoughts,
    findPublicThoughts,
    getThoughtByIdAndUser
}
