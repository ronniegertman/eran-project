// const res = require("express/lib/response");

async function run(){
    let keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
      );

      const result = {
          private: await crypto.subtle.exportKey('jwk', keyPair.privateKey),
          public: await crypto.subtle.exportKey('jwk', keyPair.publicKey)
      }
      return result
}

run().then(res => {
    console.log('here')
    document.getElementById('privateKey').value = JSON.stringify(res.private)
    document.getElementById('publicKey').value = JSON.stringify(res.public)
    const text = 'hello world'
    const encrypted = crypto.subtle.encrypt("RSA-OAEP", res.public, text).then(result => console.log(result))
})





