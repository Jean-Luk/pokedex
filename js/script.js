const pokemonName = document.querySelector('.pokemon__name')
const pokemonNumber = document.querySelector('.pokemon__number')
const pokemonImage = document.querySelector('.pokemon__image')

const form = document.querySelector('.form')
const input = document.querySelector('.input__search')

const buttonNext = document.querySelector('.btn-next')
const buttonPrev = document.querySelector('.btn-prev')

let currentPokemon

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
    if (APIResponse.status === 200) {
        // Extrair JSON da API
        const data = await APIResponse.json();
        return data;
    }
}

const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = "Loading...";
    pokemonNumber.innerHTML = "";
    const data = await fetchPokemon(pokemon.toString())

    if (data) {
        // Atualiza os elementos
        pokemonImage.style.display = 'block'
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        
        input.value = '' // Limpa o valor do imput
        currentPokemon = data.id
        return
    }
    pokemonImage.style.display = 'none'
    pokemonName.innerHTML = "Not found";
    pokemonNumber.innerHTML = '';    
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    renderPokemon(input.value)
})

buttonNext.addEventListener('click', () => {
    renderPokemon(currentPokemon+1)
})
buttonPrev.addEventListener('click', () => {
    if (currentPokemon > 1) {
        renderPokemon(currentPokemon-1)
    }
})

renderPokemon('1') // Mostrar o primeiro pokemon