const validator = require('validator')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)

console.log('connect')
    
const schema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    nickname: {
        type: String,
        trim: true
    }
    // },
    // publicKey: {
    //     type: String,
    //     required: true
    // },
    // privateKey: {
    //     type: String,
    //     required: true
    // }
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

function newUser(username, password){
    const user = new User({
        username,
        password,
    })
    
    return user
}

module.exports = {findUser, newUser, checkPassword}





