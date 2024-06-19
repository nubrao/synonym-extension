$(function() {
  const searchButton = $('#searchButton');
  const wordInput = $('#wordInput');
  const synonymsList = $('#synonymsList');
  const loader = $('#loader');
  let debounceTimeout;

  function hideLoader() {
    loader.hide();
  }

  function showLoader() {
    loader.show();
  }

  function displaySynonyms(synonyms) {
    synonymsList.empty();
    if (synonyms.length > 0) {
      synonyms.forEach(synonym => {
        const li = $('<li></li>').text(synonym);
        synonymsList.append(li);
      });
    } else {
      const li = $('<li></li>').text('Nenhum sinônimo encontrado');
      synonymsList.append(li);
    }
  }

  function sanitizeWord(word) {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  async function getCorrectLink(word) {
    const sanitizedWord = sanitizeWord(word);

    if (word === sanitizedWord) return word;

    const url = `https://dicio.com.br/pesquisa.php?q=${sanitizedWord}`;
    const { data: search, request } = await axios.get(url);

    if (request.responseURL !== url) {
      const regex = /(?<=https:\/\/www\.dicio\.com\.br\/).*(?=\/)/gi;
      if (regex.test(request.responseURL)) {
        const [extractedWord] = request.responseURL.match(regex);
        return extractedWord;
      }
    }

    const $Search = $(search);

    const words = $Search('.resultados a').find('.list-link').toArray();

    const [correctWordVariation] = words.filter((variation) => $Search(variation).text() === word);

    const link = correctWordVariation.parentNode
      ? $Search(correctWordVariation.parentNode).attr('href')
      : '';

    return link || word;
  }

  async function fetchSynonyms(word) {
    try {
      const correctWord = await getCorrectLink(word);
      const url = `https://dicio.com.br/${correctWord}`;
      const { data } = await axios.get(url);
      const $ = $(data);

      const synonyms = [];
      $('#sinonimos a', data).each((i, el) => {
        synonyms.push($(el).text().trim());
      });

      return synonyms;
    } catch (error) {
      console.error('Erro ao buscar sinônimos:', error);
      return [];
    }
  }

  async function searchSynonyms() {
    const word = wordInput.val().trim();
    if (word.length > 3) {
      showLoader();
      try {
        const synonyms = await fetchSynonyms(word);
        hideLoader();
        displaySynonyms(synonyms);
      } catch (error) {
        console.log('Erro ao buscar sinônimos:', error);
        hideLoader();
        synonymsList.html('<li>Não foi possível buscar sinônimos para a palavra digitada</li>');
      }
    } else {
      synonymsList.empty();
    }
  }

  wordInput.on('input', function() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(searchSynonyms, 300);
  });

  searchButton.on('click', searchSynonyms);
});
