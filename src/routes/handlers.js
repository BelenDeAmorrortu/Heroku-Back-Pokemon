const { Pokemon, Type } = require('../db');
const axios = require('axios');

function filterPokeInfoFromApi(data){

    const { id, name, base_experience, height, weight, types, stats, sprites } = data

    function turnToDecimal(number){

        let arr = number.toString().split('')

        if(arr.length === 1) return Number('0.' + arr[0])

        arr[arr.length - 1] = '.' + arr[arr.length - 1]
        return Number(arr.join(''))
    }

    return {

        id,
        name,
        experience: base_experience,
        height: turnToDecimal(height),
        weight: turnToDecimal(weight),
        types: types.map(obj => obj.type),
        attack: stats[1].base_stat,
        defence: stats[2].base_stat,
        speed: stats[5].base_stat, 
        img: sprites.other.dream_world.front_default,
        // img: sprites.versions['generation-v']['black-white'].animated.front_default,
        //  img: sprites.other['official-artwork'].front_default,
        source: 'Api'

    }


}

async function getApiPokemons(){

    let urls = [] // [`https://pokeapi.co/api/v2/pokemon/1`, `https://pokeapi.co/api/v2/pokemon/2`, `https://pokeapi.co/api/v2/pokemon/3`]
    
    for(let i=1; i<= 40; i++){
    
        urls.push(`https://pokeapi.co/api/v2/pokemon/${i}`)
    }
    
    async function asyncAxios(url){
    
        let request =  await axios.get(url)
    
        return request.data
    }
    
    const arrayOfPromises = urls.map(url => asyncAxios(url))
    
    const promiseAll = await Promise.all(arrayOfPromises)
    
    let filteredPromiseAll = promiseAll.map( p => filterPokeInfoFromApi(p) )

    return filteredPromiseAll
    
}

async function getDbPokemons(){

    return await Pokemon.findAll({

        include:{ model: Type, attributes: ['name'], through: {attributes: []}}
    })
}

async function getData(){

    const apiInfo = await getApiPokemons()
    const dbInfo = await getDbPokemons()

    const data = apiInfo.concat(dbInfo)

    return data
}

module.exports = { getData, getApiPokemons, getDbPokemons, filterPokeInfoFromApi}