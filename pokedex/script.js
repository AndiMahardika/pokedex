async function getPokemonList(url){
   try{
    const response = await fetch(url)
    const data = await response.json()
    const pokemonList = data.results;
    let card = ``;

    for (const poke of pokemonList) {
        const data = await getPokemonDetails(poke.url)
        const imgUrl = data.sprites.versions['generation-v']['black-white']['animated']['front_default']

        const dataPoke = {
            name: poke.name,
            gif: imgUrl
        }

        card += cardPokemon(dataPoke);
    }
    const cardContainer = document.querySelector(`.card-container`);
    cardContainer.innerHTML = card;
   } catch(error) {
        console.log(`error fetching`, error);
   }
}

async function getPokemonDetails(url){
    const response = await fetch(url)
    const data = await response.json()
    return data;
}



function cardPokemon(pokemonData){
    return `<div class="col-md-4 my-2">
                <div class="card p-3">
                <img src="${pokemonData.gif}" class="card-img-top p-4 bg-secondary-subtle" style="height: 300px;>
                    <div class="card-body">
                        <h5 class="card-title mt-1  pokemon-name"><strong>${capitalizeFirstLetter(pokemonData.name)}</strong></h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <div class="btn-group">
                            <div class="row">
                                <div class="col-md-8">
                                    <button type="button" class="btn text-bg-danger btn-sm mt-2">Fire</button>
                                    <button type="button" class="btn text-bg-primary btn-sm mt-2">Water</button>
                                    <button type="button" class="btn text-bg-success btn-sm mt-2">Plant</button>
                                    <button type="button" class="btn text-bg-warning btn-sm mt-2">Plant</button>
                                </div>
                                <div class="col-md ms-md-4">
                                <a href="#" class="btn btn-sm btn-secondary mt-2">Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}

function capitalizeFirstLetter(word){
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
}

getPokemonList(`https://pokeapi.co/api/v2/pokemon`);



