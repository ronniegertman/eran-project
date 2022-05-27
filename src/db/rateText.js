class rateText{
    //reciebes an array of feelings and returns the shortened description of the feelings
    constructor(rateArray){
        this.data = rateArray
    }

    get(){
        let str = ''
        if(this.data.length > 2){
            str = this.data[0] + ' ,' + this.data[1] + '...'
        } else if(this.data.length == 2){
            str = this.data[0] + ' ,' + this.data[1]
        } else{
            str = this.data[0]
        }

        return str
    }
}


module.exports = rateText