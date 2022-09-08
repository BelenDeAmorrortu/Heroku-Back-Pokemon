/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Pokemon, conn } = require('../../src/db.js');

const agent = session(app);

describe('Pokemon routes', () => {
  before(() => conn.authenticate()

  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));

  describe('GET /pokemons/:id', () => {

    it('should get 200 if id is valid', () =>
      agent.get('/pokemons/25').expect(200)
    );

    it("should get an object with the pokemon's detail from the Api", async()=>{

      const request = await agent.get('/pokemons/25')

      expect(request.statusCode).to.equal(200)
      expect(request.body.id).to.equal(25)
      expect(request.body.source).to.equal('Api')
      expect(request.body.name).to.equal('pikachu')
      expect(request.body.experience).to.equal(112)
      expect(request.body.height).to.equal(0.4)

    })

    it("should get an object with the pokemon's detail from the Database", async()=>{

      const DbPokemon = await Pokemon.create({name: 'myDbPokemon'})
      const id = DbPokemon.id

      const request = await agent.get(`/pokemons/${id}`)

      expect(request.statusCode).to.equal(200)
      expect(request.body.id).to.equal(id)
      expect(request.body.name).to.equal('myDbPokemon')
      expect(request.body.source).to.equal('Database')

    })

    it("should get 400 and an error if id is not valid", async()=>{

      const wrongId = '67jedf'

      const request = await agent.get(`/pokemons/${wrongId}`)

      expect(request.statusCode).to.equal(400)
      expect(request.error.text).to.equal(`${wrongId} doest not correspond to any Pokemon's id`)
    })

  });
  
});
