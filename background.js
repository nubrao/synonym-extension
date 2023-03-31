function buscarSinonimos() {
  var palavra = document.getElementById("palavra").value;
  var url = "https://dicio-api-ten.vercel.app/v2/" + palavra;
  
  axios.get(url)
    .then(response => {
      var sinonimos = response.data[0].sinonimos;
      var resultado = document.getElementById("resultado");
      resultado.innerHTML = "";
      if (sinonimos.length > 0) {
        var listaSinonimos = document.createElement("ul");
        sinonimos.forEach(sinonimo => {
          var itemLista = document.createElement("li");
          itemLista.textContent = sinonimo;
          listaSinonimos.appendChild(itemLista);
        });
        resultado.appendChild(listaSinonimos);
      } else {
        resultado.textContent = "Nenhum sinônimo encontrado.";
      }
    })
    .catch(error => {
      var resultado = document.getElementById("resultado");
      resultado.textContent = "Erro ao buscar sinônimos: " + error.message;
    });
}

document.getElementById("buscar").addEventListener("click", buscarSinonimos);
