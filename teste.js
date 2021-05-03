var listaObj = [
	{
  	nome : "Astolfo",
    sobrenome : "Berlado",
    idade : 25
  },{
  	nome : "Ester",
    sobrenome : "Pérola",
    idade : 29
  },{
  	nome : "Serj",
    sobrenome : "Harakiri",
    idade : 34
	}
]

var posicaoLista = 0

function clearTheArea(){
	document.getElementById("principal").innerHTML = ""
}

function proximo(){
	if (posicaoLista != (listaObj.length - 1)){
  	posicaoLista++
    clearTheArea()
    processaLista()
  }
}

function anterior(){
	if (posicaoLista != 0){
  	posicaoLista--
    clearTheArea()
    processaLista()
  }
}

function processaLista(){
	var Obj = listaObj[posicaoLista]
  var containerNome, containerSNome, containerIdade
  var textNome, textSNome, textIdade
  var elPrincipal = document.getElementById("principal")
  
  containerNome = document.createElement("div")
  containerSNome = document.createElement("div")
  containerIdade = document.createElement("div")
  
  textNome = document.createTextNode("Nome: " + Obj.nome)
  textSNome = document.createTextNode("Sobrenome: " + Obj.sobrenome)
  textIdade = document.createTextNode("Idade: " + Obj.idade)
  
  containerNome.appendChild(textNome)
  containerSNome.appendChild(textSNome)
  containerIdade.appendChild(textIdade)
  
  elPrincipal.appendChild(containerNome)
  elPrincipal.appendChild(containerSNome)
  elPrincipal.appendChild(containerIdade)
}
