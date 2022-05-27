// crypto module
const crypto = require("crypto");
const { type } = require("os");

class encryption{
    constructor(){
        this.algorithm = 'aes-256-cbc'
        this.initVector = Buffer.from('this is a secret')
        this.SecurityKey = Buffer.from("this is a secretthis is a secret")
    }
   encrypt(message){
        const cipher = crypto.createCipheriv(this.algorithm, this.SecurityKey, this.initVector);
        let encryptedData = cipher.update(message, "utf-8", "hex");
        encryptedData += cipher.final("hex");
        return encryptedData
   }
   decrypt(encData){
        const decipher = crypto.createDecipheriv(this.algorithm, this.SecurityKey, this.initVector);
        let decryptedData = decipher.update(encData, "hex", "utf-8")
        decryptedData += decipher.final("utf8");
        return decryptedData
   }
}

const feeling = ['עברית', 'zkc', 'שמי', 'מישל', 'רוני']
for( var i=0; i<feeling.length; i++){
    feeling[i] = new encryption().encrypt(feeling[i])
}
console.log(feeling)
for( var i=0; i<feeling.length; i++){
    feeling[i] = new encryption().decrypt(feeling[i])
}
console.log(feeling)
module.exports = encryption