if(document.getElementById('privateForUser').checked) {

    const Myelement = document.getElementById('1')
    Myelement.setAttribute('value', 'private')

}else if(document.getElementById('publicForUser').checked) {

    const Myelement = document.getElementById('1')
    Myelement.setAttribute('value', 'public')

}else{

    const Myelement = document.getElementById('1')
    Myelement.setAttribute('value', 'eran')

}