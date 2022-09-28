export const pokemonIds = [1,20,30,40];

// pokemonIds.push( +'1' );

    interface Pokemon {
        id: number;
        name: string;
        age?: number | undefined;
    }

   export const bulbasaur:Pokemon = {
        id: 1,
        name: 'bulbasaur',
        age: 2
    }
    
   export const charmander:Pokemon = {
        id: 4,
        name: 'charmander',
        age: 1
    }
    // console.log(bulbasaur);

    export const pokemons:Pokemon[] = [];

    pokemons.push( charmander , bulbasaur );

    console.log(pokemons);