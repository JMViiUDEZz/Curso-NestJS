//Explicar  el DataBinding de variables entre el controlador (ts) y la vista (html)
export let name: string = 'Jose';
export const age: number = 19;
export const IsValid:boolean = true;

name = 'Melissa';
// name = 123;
// name = true;

export const templateString = `Esto es un string
multilinea
que puede tener
" dobles
' simple
inyectar valores ${ name }
expresiones ${ 1 + 1 }
números: ${ age }
booleanos: ${ IsValid }
`

console.log( templateString );