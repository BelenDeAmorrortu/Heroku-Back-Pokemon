const { Pokemon, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Pokemon model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Pokemon.sync({ force: true }));

    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Pokemon.create({})
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });

      it('should work when its a valid name', async() => {
        const pokemon = await Pokemon.create({ name: 'Pikachu' });
        expect(pokemon.name).to.equal('Pikachu');
      });
    });

    describe('img', ()=>{

      it('should use the default value if img property is null', async()=>{

        const pokemon = await Pokemon.create({name: 'NoImage'})
        expect(pokemon.img).to.equal('https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/769px-Pokebola-pokeball-png-0.png')
      })

      it('should use the indicated url if it is passed through the img property', async()=>{

        const pokemon = await Pokemon.create({name: 'WihtImg', img:'https://seeklogo.com/images/P/pikachu-logo-42CAFBCD00-seeklogo.com.png'})
        expect(pokemon.img).to.equal('https://seeklogo.com/images/P/pikachu-logo-42CAFBCD00-seeklogo.com.png')
      })
    })

    describe('source',()=>{

      it('source should always be equal to "Database" if it is passed as null', async()=>{

        const pokemon = await Pokemon.create({name: 'henry'})
        expect(pokemon.source).to.equal('Database')
      })

    })

    it('should create the Pokemon if required properties are okay', async()=>{

      const pokemon = await Pokemon.create({
        name: 'belen',
        experience: 18,
        attack: 40,
        defence: 150,
        speed: 100,
        height: '1.5',
        weight: '50',

      })

      expect(pokemon.name).to.equal('belen')
      expect(pokemon.experience).to.equal(18)
      expect(pokemon.attack).to.equal(40)
      expect(pokemon.defence).to.equal(150)
      expect(pokemon.speed).to.equal(100)
      expect(pokemon.height).to.equal('1.5')
      expect(pokemon.weight).to.equal('50')
      expect(pokemon.img).to.equal('https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/769px-Pokebola-pokeball-png-0.png')
      expect(pokemon.source).to.equal('Database')
    })
    
  });

});
