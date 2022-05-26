// crypto module
const crypto = require("crypto")


function generate(){
    return { initVector: 'kjbhjhjvhjbjbjhbjb', Securitykey: 'hbhjvjhvkjvkjbjbjbkjbjho' }
}
function encrypt(message, object){
    const cipher = crypto.createCipheriv('aes-256-cbc', object.Securitykey, object.initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    console.log(encryptedData)
    return encryptedData
}
function decrypt(message, object){
    const decipher = crypto.createDecipheriv('aes-256-cbc', object.Securitykey, object.initVector);
    let decryptedData = decipher.update(message, "hex", "utf-8")
    decryptedData += decipher.final("utf8");
    console.log(decryptedData)
    return decryptedData
}


module.exports = { generate, encrypt, decrypt}

