const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokemonRouter = require('./Pokemon')
const typeRouter = require('./Type')

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const router = Router()
router.use('/pokemons', pokemonRouter)
router.use('/types', typeRouter)


module.exports = router;
