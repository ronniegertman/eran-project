class User{
    constructor(username, nickname){
        this.username = username
        this.nickname = nickname
    }

    getUsername(){
        return this.username
    }

    getNickname(){
        return this.nickname
    }
}

module.exports = User