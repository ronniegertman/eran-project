const form = document.querySelector("form")

function handleChangeEvent (event) {
		if(document.getElementById('privateForUser').checked) {
				const Myelement = document.getElementById('1')
				Myelement.setAttribute('value', 'private')

		}else if(document.getElementById('publicForUser').checked) {

				const Myelement = document.getElementById('1')
				Myelement.setAttribute('value', 'public')

		}else if(document.getElementById('forEran').checked){
				const Myelement = document.getElementById('1')
				Myelement.setAttribute('value', 'eran')

		}
}

form.addEventListener("change", handleChangeEvent)