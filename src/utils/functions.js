const feelingObject = require('./feelingObject')

const isFeeling = (msg) => {
    const array = msg.split(' ')
    for(var i=0; i < array.length; i++){
        if(feelingObject[array[i]]){
            return true
        }
    }
    return false
}

const getFeelings = (msg) => {
    const array = msg.split(' ')
    let newArray = []
    for(var i=0; i< array.length; i++){
        if(feelingObject[array[i]] != undefined){
            newArray.push(array[i])
        }
    }
    return newArray
}



module.exports = { isFeeling, getFeelings }