class printDate{
    //recieves a date object and returs a date description.
    constructor(date){
        this.date = date
    }

    get(){
        const arr = this.date.toString().split(' ')
        return arr[0] + ' '+ arr[1] + ' ' + arr[2] + ' ' + arr[3]+ ' ' + arr[4]

    }
}

module.exports = printDate