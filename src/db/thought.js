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
    }, 
    likes: {
        type: Array,
        default: []
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})

const Thought = mongoose.model('Thought', schema)

function newThought(username, content, header, privacy) {
    const d = new printDate(new Date()).get()
    return new Thought({ username, header, content, date: d, privacy })
    
}

function findAllThoughts(username) {
    return Thought.find({username})
}

function findPublicThoughts(){
    return Thought.find({privacy: 'public'}).sort({ createdAt: -1 })
}

function getThoughtByIdAndUser(id, username) {
    return Thought.findOne({ _id: id, username })
}

function getLastThought(username){
    return Thought.findOne({username}, {}, { sort:{
        createdAt: -1
    }})
}

function thoughtById(_id){
    return Thought.findById(_id)
}


module.exports = {
    newThought,
    findAllThoughts,
    findPublicThoughts,
    getThoughtByIdAndUser,
    getLastThought,
    thoughtById
}
