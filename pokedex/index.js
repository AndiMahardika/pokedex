const cardContainer = document.querySelector(`.card-container`);

const searchButton = document.querySelector(`.btn-search`);
const inputElement = document.querySelector(`.key-search`);

inputElement.addEventListener(`input`,function(){
    this.value = capitalizeFirstLetter(this.value)
})

searchButton.addEventListener(`click`, async function(){
    try{
        const keyword = inputElement.value.toLowerCase();
        const data = await getSearchPokemon(keyword);

        const cardSearch = createCardSearch(data);
        cardContainer.innerHTML = cardSearch;
    } catch(err){
        console.log("Error while searching for Pokémon:", err);
    }
})

// Refresh
const btnRefresh = document.querySelector(`.btn-refresh`)
btnRefresh.addEventListener(`click`,function(){
    location.reload();
})

const nextButton = document.querySelector(`.next-btn`);
const prevButton = document.querySelector(`.prev-btn`);
let offset = 0;
const limit = 20;

if (offset === 0) {
    prevButton.disabled = true;
}

nextButton.addEventListener(`click`, function(){    
    offset += limit;
    fetchPokemon(offset, limit);

    prevButton.disabled = false;
});

prevButton.addEventListener(`click`,function(){
    if(offset >= limit){
        offset -= limit;
        fetchPokemon(offset,limit)
    }  
    if(offset === 0){
        prevButton.disabled = true;
    }
})


function fetchPokemon(offset, limit) {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error('Network response was not ok`')
            }
            return response.json()
        })
        .then(async data => {
            const pokemonList  = data.results;
            cardContainer.innerHTML = ``;
    
            for (const poke of pokemonList) {
                const pokemonData = await fetch(poke.url)
                if (!pokemonData.ok) {
                    throw new Error(`Failed to fetch Pokémon data`);
                }
                const getPokemonDetails = await pokemonData.json()
                const gifUrl = getPokemonDetails.sprites.versions[`generation-v`][`black-white`][`animated`][`front_default`]
                const type = getPokemonDetails.types;

                const pokemonCardInfo = {
                    name: poke.name,
                    gif: gifUrl,
                    id: poke.url,
                    types: type
                }
                
                const card = cardPokemon(pokemonCardInfo);
                cardContainer.appendChild(card)
                
            }
            const buttonsDetails = document.querySelectorAll(`.btn-details`)
            buttonsDetails.forEach(b => {
                b.addEventListener(`click`, async function(){
                    try{
                        const pokeDetails = await createDetailsPoke(this.dataset.details);
                        const modalBody = document.querySelector(`.modal-body`);
                        modalBody.innerHTML = pokeDetails;
                    } catch(err){
                        console.log("Error while fetching Pokémon details:", err)
                    }
                })
            })
        })       
        .catch(error => {
            console.log("Error while fetching Pokémon list:", error);
        });
}

function cardPokemon(pokemonData) {
    const card = document.createElement(`div`);
    card.classList.add(`col-md-4` ,`my-2`)

    // console.log(pokemonData.types)
    const types = pokemonData.types.map(types => types.type.name);
    const typeButtons = types.map(type => {
        return `<span class="text-bg-${type} mt-2 btn-custom">${capitalizeFirstLetter(type)}</span> `
    }).join(``)

    card.innerHTML = `<div class="card" >
                        <img src="${pokemonData.gif}" class="card-img-top p-5 card-pokemon" >
                        <div class="card-body">
                            <h5 class="card-title font-oxanium">${capitalizeFirstLetter(pokemonData.name)}</h5>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                ${typeButtons}
                                <div class="row mt-2 mx-1">
                                    <a href="#" class="btn btn-md btn-primary btn-details" data-bs-toggle="modal" data-bs-target="#detailPokemon" data-details="${pokemonData.id}"><strong class="font-oxanium">Details</strong></a>
                                </div>
                        </div>
                    </div>`;
    return card;
}

async function createDetailsPoke(pokemonDataId){
    const response = await fetch(pokemonDataId)
    if (!response.ok) {
        throw new Error(`Failed to fetch Pokémon details`);
    }
    const data = await response.json()
    console.log(data)

    const content = `<div class="container-fluid">
                        <div class="row">
                        <div class="col-md-4">
                            <img src="${data.sprites.other.dream_world.front_default}" alt="..." class="img-fluid">
                        </div>
                        <div class="col-md-8">
                            <h5 class="card-title text-center font-oxanium"> ${capitalizeFirstLetter(data.name)} </h5>
                            <ul class="list-group list-group-flush">
                            <li class="list-group-item font-oxanium"><strong>Ability : </strong> ${data.abilities.map(ability => ability.ability.name).join(`, `)} </li>
                            <li class="list-group-item font-oxanium"><strong>Height :</strong> ${data.height} </li>
                            <li class="list-group-item font-oxanium"><strong>Weight :</strong> ${data.weight} </li>
                            <li class="list-group-item font-oxanium"><strong>Species :</strong> ${data.types.map(typeObject => typeObject.type.name)} </li>
                            </ul>
                        </div>
                        </div>
                    </div>`;
    return content;
    }

async function getSearchPokemon(keyword){
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${keyword}`);
        if(!response.ok){
            throw new Error(`Pokémon ${response.statusText}`);
        }
        const data = await response.json();
        return data;
}

function createCardSearch(pokemonData){
    return `<div class="card mb-3 bg-primary-subtle col-lg-8 mx-sm-auto">
                <div class="row g-0">
                    <div class="col-md-4 my-sm-3 my-2">
                        <img src="${pokemonData.sprites.front_default}" class="img-fluid rounded-start card-pokemon" alt="..." style="width: 100%; height: 100%;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                        <h5 class="card-title font-oxanium"><strong>${capitalizeFirstLetter(pokemonData.name)}</strong></h5>
                        <ul class="list-group">
                            <li class="list-group-item active bg-danger" aria-current="true"><strong>Power : ${pokemonData.base_experience}</strong></li>
                            <li class="list-group-item"><strong>Height : </strong>${pokemonData.height}</li>
                            <li class="list-group-item"><strong>Weight : </strong>${pokemonData.weight}</li>
                            <li class="list-group-item"><strong>Abilities : </strong>${pokemonData.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(`, `)}</li>
                            <li class="list-group-item"><strong>Species : </strong>${pokemonData.types.map(typesIndex => capitalizeFirstLetter(typesIndex.type.name)).join(`, `)}</li>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>`
}

function capitalizeFirstLetter(word){
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
}

fetchPokemon(offset, limit)