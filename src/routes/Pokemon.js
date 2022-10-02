const { Router } = require('express');
const { Pokemon, Type } = require('../db');
const axios = require('axios');
const router = Router();
const {getData, getDbPokemons, filterPokeInfoFromApi} = require('./handlers')


router.get('/', async(req, res)=>{

    const { name } = req.query

    if(!name){

        try{
            let data = await getData()
            let filteredPokeInfo = data.map(p =>{

                return{

                    id: p.id,
                    name: p.name,
                    img: p.img,
                    types: p.types.map(obj => obj.name),
                    source: p.source,
                    attack: p.attack
                }
            })
            res.json(filteredPokeInfo)
        }

        catch(e){

            res.status(400).send(e)
        }
    }

    else{

        try{

            let data = await getDbPokemons()

            let searchedPokemon = data.find(p => p.name === name)

            if(!searchedPokemon){

                let api = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)

                searchedPokemon = filterPokeInfoFromApi(api.data)
            }

            let filteredPokeInfo = [searchedPokemon].map(p =>{

                return{
                    id: p.id,
                    name: p.name,
                    img: p.img,
                    types: p.types.map(obj => obj.name)
                }
            })

            res.json(filteredPokeInfo)

        }

        catch(e){

            res.status(400).send(`${name} is not a Pokemon`)
        }
    }

})

router.get('/:id', async(req, res)=>{

    const { id } = req.params

    try{

        let pokemons = await getDbPokemons()

        let searchedPokemon = pokemons.find(p => p.id === id)

        if(!searchedPokemon){

            let api = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)

            searchedPokemon = filterPokeInfoFromApi(api.data)

        }

        searchedPokemon.types = searchedPokemon.types.map(obj => obj.name)

        return res.json(searchedPokemon)
    }

    catch(e){

        res.status(400).send(`${id} doest not correspond to any Pokemon's id`)
    }

})

router.post('/', async(req, res)=>{

    const { name, experience, attack, defence, speed, height, weight, img, types} = req.body

    if(name){

        try{

            const newPokemon = await Pokemon.create({ name, experience, attack, defence, speed, height, weight, img })

            const typesDb = await Type.findAll({

                where:{name: types}
            })

            newPokemon.addType(typesDb)

            res.send('Pokemon Created Successfully')

        }
        catch(e){
            res.status(400).send(e)
        }

    }

    else res.send('To create a Pokemon it needs to have a name')


})

router.delete('/:id', async(req, res)=>{
    
    const {id} = req.params

    if(id){

        try{
            await Pokemon.destroy({where: {id: id}})

            res.send('Pokemon was deleted')
        }

        catch(e){
            
            res.status(400).send(e)
        }
    }
})

module.exports = router;
