var count = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
console.log('script')

function handleButton(button){
    console.log('click')
    count[button.id - 1] ++ 
    if(count[button.id - 1] % 2 === 1){
        button.style.backgroundColor = "rgba(30, 65, 107, 0.4)"
    }else{
        button.style.backgroundColor = "white"
    }
    var toSend = {
        מבוכה: count[0]% 2 === 1,
        מועקה: count[1] % 2 === 1,
        מתח: count[2] % 2 === 1,
        ריקנות: count[3] % 2 === 1, 
        שעמום: count[4] % 2 === 1,
        תקיעות: count[5] % 2 === 1,
        עייפות: count[6] % 2 ===1,
        עצבים: count[7] % 2 ===1,
        קנאה: count[8] % 2 === 1,
        תסכול: count[9] % 2 ===1,
        יציבות: count[10] % 2 === 1,
        כוח: count[11] % 2 === 1,
        שמחה: count[12] % 2 ===1,
        תקווה: count[13] % 2 === 1,
        חוזק: count[14] % 2 === 1,
        צמיחה: count[15] % 2 ===1,
        קבלה: count[16] % 2 === 1,
        שייכות: count[17] % 2 ===1,
        ריכוז: count[18] % 2 === 1,
        אומץ: count[19] % 2 === 1,
        
    }
    const Myelement = document.getElementById('toSend')
    Myelement.setAttribute('value', JSON.stringify(toSend))
}




