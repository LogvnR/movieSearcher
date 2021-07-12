// ==== Main Content =====
const mainForm = document.querySelector('.mainForm');
const userSelect = document.querySelector('#userSelect');
const userInput = document.querySelector('.mainUserInput');
const submitBtn = document.querySelector('.submitBtn');
const mainTitle = document.querySelector('h1');
// ===== Results Selectors =====
const resetBtn = document.querySelector('.resetBtn');
const resultContainer = document.querySelector('.searchResults-Container');
// const result = document.querySelectorAll('.searchResults');
// const actorSearch = document.querySelectorAll('.actorNameTxt');
// ===== API Key =====
const logvn = 'k_zfad24qn';

// ===== Entry Creator =====
const entryCreator = (movieImg, movieTitle) => {
  const newDiv = document.createElement('div');
  const newImg = document.createElement('img');
  const newTextDiv = document.createElement('div');
  const newH3 = document.createElement('h3');
  newDiv.classList.add('searchResults');
  newImg.classList.add('mediaImg');
  newImg.src = movieImg;
  newDiv.appendChild(newImg);
  newTextDiv.classList.add('mediaTitle-Container');
  newDiv.appendChild(newTextDiv);
  newH3.classList.add('mediaTitle');
  newH3.innerText = movieTitle;
  newTextDiv.appendChild(newH3);
  resultContainer.appendChild(newDiv);
};

const entryCreatorSub = (movieTitle) => {
  const newDiv = document.createElement('div');
  const newTextDiv = document.createElement('div');
  const newH3 = document.createElement('h3');
  newDiv.classList.add('searchResults-Sub');
  newTextDiv.classList.add('mediaTitle-Container');
  newDiv.appendChild(newTextDiv);
  newH3.classList.add('mediaTitle');
  newH3.innerText = movieTitle;
  newTextDiv.appendChild(newH3);
  resultContainer.appendChild(newDiv);
};

const entryCreatorCast = (actorImg, actorName, actorRole) => {
  const newDiv = document.createElement('div');
  const newImg = document.createElement('img');
  const newTextDiv = document.createElement('div');
  const newP = document.createElement('p');
  const actorSpan = document.createElement('span');
  const asSpan = document.createElement('span');
  newDiv.classList.add('searchResults');
  newImg.classList.add('mediaImg');
  newImg.src = actorImg;
  newDiv.appendChild(newImg);
  newTextDiv.classList.add('mediaTitle-Container');
  newDiv.appendChild(newTextDiv);
  newP.classList.add('mediaTitle');
  actorSpan.innerText = `${actorName}`;
  actorSpan.classList.add('actorNameTxt');
  newP.appendChild(actorSpan);
  asSpan.innerText = ` as ${actorRole}`;
  newP.appendChild(asSpan);
  newTextDiv.appendChild(newP);
  resultContainer.appendChild(newDiv);
};

// ===== Input Options =====
const inputErr = () => {
  mainTitle.innerText = 'Please Select Option Or Add a Name or Title';
};

const generalErr = () => {
  mainTitle.innerText = 'There has been an error, please try again later';
};

const inputReset = () => {
  mainTitle.innerText = 'Welcome To The Movie Searcher';
  userInput.value = '';
  userSelect.value = 'NONE';
};
// ========== API Call ==========
// ===== Actor Name =====
const addActor = (name) => {
  const updateActor = async (name) => {
    const aquiredActor = await getActor(name);
    for (let movie of aquiredActor.knownFor) {
      entryCreator(movie.image, movie.title);
    }

    for (let actorCast of aquiredActor.castMovies) {
      entryCreatorSub(actorCast.title);
    }
  };
  const getActor = async (name) => {
    const actorData = await searchActor(name);
    mainTitle.innerText = `Here are the Results for ${actorData.name}`;
    try {
      const config = { headers: { Accept: 'application/json' } };
      const res = await axios.get(
        `https://imdb-api.com/en/API/Name/${logvn}/${actorData.id}`,
        config
      );
      const actorMovies = {
        knownFor: res.data.knownFor,
        castMovies: res.data.castMovies,
      };
      return actorMovies;
    } catch (e) {
      console.log(e);
      generalErr();
    }
  };
  const searchActor = async (name) => {
    try {
      let newName = '';
      if (name.indexOf(' ') >= 0) {
        newName = name.replace(/\s/g, '%20');
      }
      const config = { headers: { Accept: 'application/json' } };
      const res = await axios.get(
        `https://imdb-api.com/en/API/SearchName/${logvn}/${newName}`,
        config
      );
      const person = {
        id: res.data.results[0].id,
        name: res.data.results[0].title,
      };

      return person;
    } catch (e) {
      console.log(e);
      generalErr();
    }
  };
  updateActor(name);
};

// ===== Movie Cast =====
const addMovie = (movie) => {
  const updateMovie = async (movie) => {
    const aquiredMovie = await getMovie(movie);
    for (let cast of aquiredMovie) {
      entryCreatorCast(cast.image, cast.name, cast.asCharacter);
    }
    // console.log(aquiredMovie);
  };

  const getMovie = async (movie) => {
    const movieData = await searchMovie(movie);
    mainTitle.innerText = `Here are the Results for ${movieData.name}`;
    try {
      const config = { headers: { Accept: 'application/json' } };
      const res = await axios.get(
        `https://imdb-api.com/en/API/FullCast/${logvn}/${movieData.id}`,
        config
      );
      return res.data.actors;
    } catch (e) {
      console.log(e);
      generalErr();
    }
  };
  const searchMovie = async (title) => {
    try {
      let newTitle = title;
      if (title.indexOf(' ') >= 0) {
        newTitle = title.replace(/\s/g, '%20');
      }
      const config = { headers: { Accept: 'application/json' } };
      const res = await axios.get(
        `https://imdb-api.com/en/API/SearchMovie/${logvn}/${newTitle}`,
        config
      );
      const film = {
        id: res.data.results[0].id,
        name: res.data.results[0].title,
      };
      return film;
    } catch (e) {
      console.log(e);
      generalErr();
    }
  };
  updateMovie(movie);
};

// ===== TV Show =====
const addSeries = (title) => {
  const updateSeries = async (title) => {
    const aquiredSeries = await getSeries(title);
    for (let cast of aquiredSeries) {
      entryCreatorCast(cast.image, cast.name, cast.asCharacter);
    }
    // console.log(aquiredMovie);
  };

  const getSeries = async (title) => {
    const seriesData = await searchSeries(title);
    mainTitle.innerText = `Here are the Results for ${seriesData.name}`;
    try {
      const config = { headers: { Accept: 'application/json' } };
      const res = await axios.get(
        `https://imdb-api.com/en/API/FullCast/${logvn}/${seriesData.id}`,
        config
      );
      return res.data.actors;
    } catch (e) {
      console.log(e);
      generalErr();
    }
  };
  const searchSeries = async (title) => {
    try {
      let newTitle = title;
      if (title.indexOf(' ') >= 0) {
        newTitle = title.replace(/\s/g, '%20');
      }
      const config = { headers: { Accept: 'application/json' } };
      const res = await axios.get(
        `https://imdb-api.com/en/API/SearchSeries/${logvn}/${newTitle}`,
        config
      );
      const tvSeries = {
        id: res.data.results[0].id,
        name: res.data.results[0].title,
      };
      return tvSeries;
    } catch (e) {
      console.log(e);
      generalErr();
    }
  };
  updateSeries(title);
};

mainForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (userInput.value === '' || userSelect.value === 'NONE') {
    inputErr();
  } else if (userSelect.value === 'actor') {
    resultContainer.innerHTML = '';
    addActor(userInput.value);
    inputReset();
  } else if (userSelect.value === 'movie') {
    resultContainer.innerHTML = '';
    addMovie(userInput.value);
  } else {
    resultContainer.innerHTML = '';
    addSeries(userInput.value);
  }
});

// for (let button of result) {
//   button.addEventListener('click', () => {
//     console.log(result);
//   });
// }

resetBtn.addEventListener('click', function (e) {
  resultContainer.innerHTML = '';
  inputReset();
});
