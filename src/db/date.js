class printDate{
    constructor(date){
        this.date = date
    }

    get(){
        return this.date.getDate() + '/' + this.date.getMonth() + 1 + '/' + this.date.getFullYear() + ' ' + this.date.getHours() + ':' + this.date.getMinutes()
    }
}

module.exports = printDate