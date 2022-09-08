const { Router } = require('express');
const { Type } = require('../db');
const router = Router();
const axios = require('axios')

router.get('/', async(req, res)=>{

    let types = await axios.get('https://pokeapi.co/api/v2/type')

    types = types.data.results.map(t => t.name)

    types.forEach( type =>{

        Type.findOrCreate({ where: { name: type } })
    })

    const allTypes = await Type.findAll()

    res.json(allTypes)

})

module.exports = router;