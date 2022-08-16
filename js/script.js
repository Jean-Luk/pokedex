// Divs & main
const centerContainer = document.querySelector('.center__container')
const tutorial = document.querySelector('.tutorial__text')
const main = document.querySelector('main')

// Pokemon info to be displayed
const pokemonName = document.querySelector('.pokemon__name')
const pokemonNumber = document.querySelector('.pokemon__number')
const pokemonImage = document.querySelector('.pokemon__image')
const pokemonType = document.querySelector('.pokemon__type')
const pokemonStats = document.querySelector('.pokemon__stats')

// Form
const form = document.querySelector('.form')
const input = document.querySelector('.input__search')

// Buttons
const buttonNext = document.querySelector('.btn-next')
const buttonPrev = document.querySelector('.btn-prev')

const buttonNextSprite = document.querySelector('.btn-next-img')
const buttonPrevSprite = document.querySelector('.btn-prev-img')

// Variables setup
let currentPokemon; // Current pokemon is used to managed which pokemon will be displayed when clicking "next" and "previous" buttons
let currentSprite = 0; // Same for current sprite
let pokemonImages = [];

// At first, only form and tutorial will be displayed on the page
centerContainer.style.display = "none";

pokemonType.style.display = "none";
pokemonImage.style.opacity = '0'
pokemonNumber.innerHTML = '';

main.style["margin-top"] = "30vh" // Position form and tutorial on the center of the page

let waitingFirstInput = true;

function firstInputReceived () { // On first input, trigger animations
    waitingFirstInput = false

    let margin = 30 // margin and animation controller

    // Hide tutorial text and starts to rise the input
    tutorial.classList.add("hidden")
    const animationInterval = setInterval(updateMargin, 10)

    function updateMargin () {
        margin--
        main.style["marginTop"] = `${margin}vh`;

        if (margin === 5) {
            centerContainer.style.display = "block";
        } else if (margin === 4) {
            clearInterval(animationInterval);
            centerContainer.classList.add("hidden-off")
        }
    }
}

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
    if (APIResponse.status === 200) {
        // Extract JSON from pokeAPI
        const data = await APIResponse.json();

        return data;
    }
}

const renderPokemon = async (pokemon) => {
    // Display loading and hide pokemon number
    pokemonName.innerHTML = "Loading...";
    pokemonNumber.innerHTML = ""; 

    const data = await fetchPokemon(pokemon.toString())

    if (data) { // if data is successfully loaded
        // Update elements
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;

        // Setup pokemon types display
        pokemonType.style.display = "";
        pokemonType.innerHTML = ""
        for (type of data.types) { // for each type, create new element inside pokemon__type
            const typeBlock = document.createElement("div")
            typeBlock.innerHTML = type.type.name
            typeBlock.classList.add('block')
            pokemonType.appendChild(typeBlock)
        }

        // Show the image and load images from data
        pokemonImage.style.opacity = '1'

        pokemonImages = []
        pokemonImages.push(data['sprites']['other']['official-artwork']['front_default'])
        pokemonImages.push(data['sprites']['versions']['generation-viii']['icons']['front_default'])
        pokemonImages.push(data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'])

        pokemonImage.src = pokemonImages[currentSprite];
        
        input.value = '' // Clear input value
        currentPokemon = data.id
        return
    }
    // If can't load data, then display error message
    pokemonImage.style.opacity = '0'
    pokemonName.innerHTML = "Not found";
    pokemonType.style.display = "none";
    pokemonNumber.innerHTML = '';
}

// Form submit listener
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (waitingFirstInput) firstInputReceived();
    renderPokemon(input.value)
})

// Next and Prev buttons listener
buttonNext.addEventListener('click', () => {
    if (currentPokemon < 905) {
        renderPokemon(currentPokemon+1);
    }
})
buttonPrev.addEventListener('click', () => {
    if (currentPokemon > 1) {
        renderPokemon(currentPokemon-1);
    }
})

// Next img and Prev img buttons listener
buttonNextSprite.addEventListener('click', () => {
    if (currentSprite < pokemonImages.length-1) {
        currentSprite++
    } else {
        currentSprite = 0
    }
    pokemonImage.src = pokemonImages[currentSprite];
})
buttonPrevSprite.addEventListener('click', () => {
    if (currentSprite > 0) {
        currentSprite--
    } else {
        currentSprite = pokemonImages.length-1
    }
    pokemonImage.src = pokemonImages[currentSprite];
})
