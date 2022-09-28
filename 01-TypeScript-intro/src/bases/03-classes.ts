export class Pokemon {

    constructor( 
        public readonly id: number,
        public name: string
    ) {

    }
}

export const charmander = new Pokemon( 4, 'Charmander' )

// charmander.id = 10;
// charmander.name = 'Mew';