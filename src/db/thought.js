const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Eran')

console.log('connect')


const Thought = mongoose.model('Thought', {
    username: {
        type: String,
        trim: true,
        required: true
    },
    header: {
        type: String,
        trim: true,
        default: 'New thought'
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    isPrivate:{
        type: Boolean,
        default: true
    }
})

function newThought(username, content, header, isPrivate) {
    return new Thought({username, content, header, isPrivate})
    
}

function findAllThoughts(username) {
    return Thought.find({username})
}

function findThought(username, date) {
    return Thought.find({username, date})
    
}

module.exports = {
    newThought,
    findAllThoughts,
    findThought
}
