// http://www.omdbapi.com/?i=tt3896198&apikey=1b54b64&s=    

const searchButton = document.querySelector(`.btn-search`)

searchButton.addEventListener(`click`,function(){
    const keyword = document.querySelector(`.keyword-search`);
    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1b54b64&s=` + keyword.value)
        .then(respons => respons.json())
        .then(movies => {
            const movie = movies.Search;
            let cards = ``;
            movie.forEach(m => {
                cards += createCard(m); 
            });
            const cardContainer = document.querySelector(`.card-container`);
            cardContainer.innerHTML = cards;

            const btnDetailMovie = document.querySelectorAll(`.btn-detailMovie`);
            btnDetailMovie.forEach(b => {
                b.addEventListener(`click`,function(){
                    fetch(`http://www.omdbapi.com/?apikey=1b54b64&i=` + this.dataset.imdbid)
                        .then(respons => respons.json())
                        .then(m => {
                            const detailModal = createDetailModal(m);
                            const modalBody = document.querySelector(`.modal-body`);
                            modalBody.innerHTML = detailModal;
                        })
                        .catch(err => console.log(`ERROR ` + err))
                }); 
            }); 
        })
        .catch(err => console.log(`ERROR ` + err))
});

function createCard(m){
    return `<div class="col-md-4 my-3">
                <div class="card">
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