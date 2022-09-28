export class Pokemon {

    get imageUrl() {
        return `http://pokemon.com/${ this.id }.jpg`;
    }

    constructor( 
        public readonly id: number,
        public name: string,
        // public imageUrl: string,
    ) {}

    scream() {
        console.log(`${ this.name.toUpperCase() }!!!`);
    }

    speak() {
        console.log(`${ this.name }, ${ this.name }`);
    }
}

export const charmander = new Pokemon( 4, 'Charmander' )

// charmander.id = 10;
// charmander.name = 'Mew';

console.log( charmander )

charmander.scream();
charmander.speak();
