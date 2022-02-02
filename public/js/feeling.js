var count = [0, 0, 0, 0, 0, 0]

function handleButton(button){
    console.log('click')
    count[button.id - 1] ++ 
    if(count[button.id - 1] % 2 === 1){
        button.style.backgroundColor = "green"
    }else{
        button.style.backgroundColor = "white"
    }
    var toSend = {
        cry: count[0]% 2 === 1,
        depressed: count[1] % 2 === 1,
        happy: count[2] % 2 === 1,
        stressed: count[3] % 2 === 1, 
        disappointed: count[4] % 2 === 1,
        calm: count[5] % 2 === 1
    }
    const Myelement = document.getElementById('7')
    Myelement.setAttribute('value', JSON.stringify(toSend))
}

document.h




