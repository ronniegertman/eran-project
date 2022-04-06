// const res = require("express/lib/response");
async function encrypt(keyPair, message) {
  let enc = new TextEncoder();
  let text = enc.encode(message);
  const encrypted = await crypto.subtle.encrypt("RSA-OAEP", keyPair.publicKey, text);
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}

async function decrypt(keyPair, encrypted) {
  try{
    const buffer = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0))
    const decrypted = await crypto.subtle.decrypt("RSA-OAEP", keyPair.privateKey, buffer);
    let dec = new TextDecoder();
    return(dec.decode(decrypted));
  } catch(e){
    console.error(e )
  }

}

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
      

    
      const enc = await encrypt(keyPair, 'hello world');
      const dec = await decrypt(keyPair, enc)
      console.log(enc)
      console.log(dec)
      // console.log(btoa(String.fromCharCode(...new Uint8Array(enc))))


      const result = {
          private: await crypto.subtle.exportKey('jwk', keyPair.privateKey),
          public: await crypto.subtle.exportKey('jwk', keyPair.publicKey)
      }
      return result
}

run().then(res => {
    
    console.log('here')
    // document.getElementById('privateKey').value = JSON.stringify(res.private)
    // document.getElementById('publicKey').value = JSON.stringify(res.public)
    
})







