const crypto = require('crypto')

class encrypt{
    constructor(){
        this.algorithm = 'aes-256-cbc'
        this.key = crypto.randomBytes(32)
        this.iv = crypto.randomBytes(16)
    }

    encrypt(text){
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.key), this.iv)
        let encrypted = cipher.update(text)
        encrypted = Buffer.concat([encrypted, cipher.final()])
        return { iv: this.iv.toString('hex'), encryptedData: encrypted.toString('hex') }

    }

    decrypt(text){
        let iv = Buffer.from(text.iv, 'hex')
        let encryptedText = Buffer.from(text.encryptedData, 'hex')
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.key), iv)
        let decrypted = decipher.update(encryptedText)
        decrypted = Buffer.concat([decrypted, decipher.final()])
        return decrypted.toString()
    }


}

module.exports = encrypt
// const e = new encrypt()
// const e1 = e.encrypt('hello world')
// console.log(e.decrypt(e1))