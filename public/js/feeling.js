var count = [0, 0, 0, 0, 0, 0]

function handleButton(button){
    count[button.id - 1] ++ 
    if(count[button.id - 1] % 2 === 1){
        button.style.backgroundColor = "green"
    }else{
        button.style.backgroundColor = "white"
    }
    var toSend = {
        בכי: count[0]% 2 === 1,
        דיכאון: count[1] % 2 === 1,
        שמחה: count[2] % 2 === 1,
        לחץ: count[3] % 2 === 1, 
        אכזבה: count[4] % 2 === 1,
        רוגע: count[5] % 2 === 1
    }
    const Myelement = document.getElementById('7')
    Myelement.setAttribute('value', JSON.stringify(toSend))
}

document.h




