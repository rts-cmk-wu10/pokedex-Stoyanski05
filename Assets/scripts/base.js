const URL = new URLSearchParams(window.location.search)
let OFFSET = parseInt(URL.get("offset") || "0")

const NEXT_PAGE = document.querySelector(".nintendo__arrow--top")
const PREV_PAGE = document.querySelector(".nintendo__arrow--bottom")
const PREV_POKEMON = document.querySelector('.nintendo__arrow--left')
const NEXT_POKEMON = document.querySelector('.nintendo__arrow--right')

const SPINNER = document.querySelector('.spinner')

const apiUrl = 'https://pokeapi.co/api/v2/pokemon/'
const SCREEN = document.querySelector(".nintendo__screen")

function appendPokemon(pokemonName) {
    fetch(apiUrl + pokemonName).then(function (response) {
        return response.json()
    }).then(function (data) {
        PREV_POKEMON.addEventListener('click', () => {
            if (data.id > 0) {
                fetch(apiUrl + (data.id - 1))
                    .then(prevRes => prevRes.json())
                    .then(prevData => {
                        SCREEN.innerHTML = `
                    <img class="nintendo__picture" src="${prevData.sprites.other['official-artwork'].front_default}">
                    <p>Height: ${prevData.height}</p>
                    <ul>${prevData.abilities.map(
                            elem => `<li>${elem.ability.name}</li>`
                        ).join("")}</ul>
                    <p>Abilities</p>
                    <h1>${prevData.name}</h1>
                    `
                    })
            }
        })

        NEXT_POKEMON.addEventListener('click', () => {
            fetch(apiUrl + (data.id + 1))
                .then(nextRes => nextRes.json())
                .then(nextData => {
                    SCREEN.innerHTML = `
                    <img class="nintendo__picture" src="${nextData.sprites.other['official-artwork'].front_default}">
                    <p>Height: ${nextData.height}</p>
                    <ul>${nextData.abilities.map(
                        elem => `<li>${elem.ability.name}</li>`
                    ).join("")}</ul>
                    <p>Abilities</p>
                    <h1>${nextData.name}</h1>
                    `
                })
        })

        SCREEN.innerHTML = `
		<img class="nintendo__picture" src="${data.sprites.other['official-artwork'].front_default}">
		<p>Height: ${data.height}</p>
		<ul>${data.abilities.map(
            elem => `<li>${elem.ability.name}</li>`
        ).join("")}</ul>
		<p>Abilities</p>
		<h1>${data.name}</h1>
        `
    })
}

function appendPokemonList() {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${OFFSET}`)
        .then(function (response) {
            if (response.status === 200) {
                return response.json()
            }
        })
        .then(function (data) {
            const UL = document.querySelector(".nintendo__list")
            data.results.forEach(function (result) {
                const LI = document.createElement("li")
                LI.innerHTML = `<a class="nintendo__pokemon" href="/?name=${result.name}">${result.name}</a>`
                UL.append(LI)
            })
        })
}

if (URL.has('name')) {
    SPINNER.style.display = 'block'
    appendPokemon(URL.get('name'))
    SPINNER.style.display = 'none'
} else {
    SPINNER.style.display = 'block'
    appendPokemonList()
    SPINNER.style.display = 'none'
}

NEXT_PAGE.addEventListener('click', function () {
    window.location.href = `/?offset=${OFFSET + 20}`
})

PREV_PAGE.addEventListener('click', function () {
    if (OFFSET > 0) {
        window.location.href = `/?offset=${OFFSET - 20}`
    } else {
        OFFSET = 0
    }
})

function pokemonList() {
    fetch(apiUrl + "?limit=10000").then(result => result.json()).then(data => {
        const dataList = document.getElementById("pokemons")
        console.log(dataList);

        data.results.forEach(pokemon => {
            const option = document.createElement("option")
            option.innerHTML = pokemon.name
            dataList.append(option)
        })
    })
}

pokemonList()