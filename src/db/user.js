const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Eran')

console.log('connect')

const schema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})


const User = mongoose.model('User', schema)

function findUser(username){
    return User.find({ username })
}

function checkPassword(username, password){
    return User.find({ username, password })
}

function newUser(username, password, nickname){
    const user = new User({
        username,
        password,
        nickname
    })
    
    return user
}

module.exports = {findUser, newUser, checkPassword}





