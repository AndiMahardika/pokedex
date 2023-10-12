const btnSearch = document.querySelector(`.btn-search`);
btnSearch.addEventListener(`click`,async function(){
    try{
        const keywordSearch = document.querySelector(`.keyword-search`);
        const movies = await getMovies(keywordSearch.value);
        updateUI(movies);
    } catch(err){
        // console.log(err)
        alert(err);
    }
});

// function getMovies(keyword){
//     return fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1b54b64&s=` + keyword)
//         .then(response => response.json())
//         .then(response => response.Search)
// };

function getMovies(keyword){
    return fetch(`http://www.omdbapi.com/?apikey=1b54b64&s=` + keyword)
        .then(response => {
                // console.log(response)
                if(!response.ok){
                    throw new Error(response.statusText);
                }
                return response.json();
            })
        .then(response => {
            // console.log(response);
            if(response.Response === "False"){
                throw new Error(response.Error);
            }
            return response.Search;
        })
};

function updateUI(movies){
    let cards = ``;
    movies.forEach(e => {
        cards += createCard(e);
    });
    const cardContainer = document.querySelector(`.card-container`);
    cardContainer.innerHTML = cards;
};

// function updateUI(movies) {
//     const cardContainer = document.querySelector(`.card-container`);
//     cardContainer.innerHTML = ``;

//     for (const movie of movies) {
//         const card = createCard(movie);
//         cardContainer.innerHTML += card;
//     }
// }


document.addEventListener(`click`,async function(e){
    if(e.target.classList.contains(`btn-detailMovie`)){
        try{
            const imdbid = e.target.dataset.imdbid;
            const movieDetails = await getmovieDetails(imdbid);
            updateUIDetails(movieDetails);
        } catch(err){
            console.log(err);
        }
    }
});

// function getmovieDetails(imdbid){
//     return fetch(`http://www.omdbapi.com/?apikey=1b54b64&i=` + imdbid)
//         .then(respons => respons.json())
//         .then(m => m )
// }

function getmovieDetails(imdbid){
    return fetch(`http://www.omdbapi.com/?apikey=1b54b64&i=` + imdbid)
        .then(respons => {
            if(!respons.ok){
                throw new Error(respons.statusText);
            }
            return respons.json();
        })
        .then(m => {
            if(m.Response === "False"){
                throw new Error(`Movie details not found`);
            }
            return m;
        })
}

function updateUIDetails(movieDetails){
    const detailModal = createDetailModal(movieDetails);
    const modalBody = document.querySelector(`.modal-body`);
    modalBody.innerHTML = detailModal;
}

function createCard(m){
    return `<div class="col-md-4 my-3">
                <div class="card w-100 h-100">
                    <img src="${m.Poster}" class="card-img-top">
                    <div class="card-body">
                    <h5 class="card-title">${m.Title}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">${m.Year}</h6>
                    <a href="#" class="btn btn-primary btn-detailMovie" data-bs-toggle="modal" data-bs-target="#detailMovie" data-imdbid="${m.imdbID}">Detail</a>
                    </div>
                </div>
            </div>`
};

function createDetailModal(m) {
    return `<div class="container-fluid">
    <div class="row">
      <div class="col-md-4">
        <img src="${m.Poster}" class="img-fluid">
      </div>
      <div class="col-md">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${m.Title}</li>
          <li class="list-group-item"><strong>Director  :</strong> ${m.Director} </li>
          <li class="list-group-item"><strong>Writer  :</strong> ${m.Writer} </li>
          <li class="list-group-item"><strong>Actors  :</strong> ${m.Actors} </li>
          <li class="list-group-item"><strong>Plot  :</strong><br> ${m.Plot} </li>
        </ul>
      </div>
    </div>
  </div>`
}