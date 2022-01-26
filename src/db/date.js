class printDate{
    constructor(date){
        this.date = date
    }

    get(){
        return this.date.getDate() + '/' + this.date.getMonth() + 1 + '/' + this.date.getFullYear()
    }
}

module.exports = printDate