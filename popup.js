document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('searchButton');
  const wordInput = document.getElementById('wordInput');
  const synonymsList = document.getElementById('synonymsList');
  const loader = document.getElementById('loader');

  function hideLoader() {
    loader.style.display = 'none';
  }
  function showLoader() {
    loader.style.display = 'block';
  }

  function displaySynonyms(synonyms) {
    synonymsList.innerHTML = '';
    if (synonyms.length > 0) {
      for (let i = 0; i < synonyms.length; i++) {
        const li = document.createElement('li');
        li.textContent = synonyms[i];
        synonymsList.appendChild(li);
      }
    } else {
      const li = document.createElement('li');
      li.textContent = 'Nenhum sinônimo encontrado';
      synonymsList.appendChild(li);
    }
  }


  function searchSynonyms() {
    const word = wordInput.value.trim();
    if (word !== '') {
      hideLoader();
      showLoader();
      axios.get(`https://dicio-api-ten.vercel.app/v2/sinonimos/${word}`)
        .then(response => {
          const synonyms = response.data;
          hideLoader();
          displaySynonyms(synonyms);
        })
        .catch(error => {
          console.log('Erro ao buscar sinônimos:', error);
          hideLoader();
          synonymsList.innerHTML = '<li>Não foi possível buscar sinônimos para a palavra digitada</li>';
        });
    } else {
      synonymsList.innerHTML = '<li>Por favor, digite uma palavra para procurar sinônimos</li>';
    }
  }


  searchButton.addEventListener('click', searchSynonyms);

});