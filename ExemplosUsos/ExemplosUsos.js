// imports necessários//

import * as moduloAerovia from '../Aerovia/Aerovia.js';
import * as moduloPiloto from '../Piloto/Piloto.js';
import * as moduloAeronave from '../Aeronave/Aeronaves.js';


// exemplo de uso piloto //

console.log('----------------RECUPERA PILOTOS-------------------\n');

let exemploPiloto = new moduloPiloto.ServicoPilotos('Pilotos.csv');
    for (let valores of exemploPiloto.todos()){
        console.log(`${valores}`);
    } 

console.log('----------------RECUPER PILOTO COM BASE NA MATRÍCULA-------------------\n')
try {
    const piloto = exemploPiloto.recupera('222');
    console.log(piloto.toString());
} catch (error) {
    console.error(error.message); 
}

console.log('----------FIM DO EXEMPLO PILOTO ------------\n');




// exemplos de uso aerovias //

console.log('----------------RECUPERA AEROVIAS------------------\n')
let exemploAerovia = new moduloAerovia.ServicoAerovias('Aerovia.json');

try {
    const aerovia = exemploAerovia.recuperaOrigemDestino('POA','GRU');
    console.log(aerovia.toString()); 
} catch (error) {
    console.error(error.message); 
}


console.log('----------FIM DO EXEMPLO AEROVIAS------------\n');


// exemplos de uso aeronave //

console.log('----------------IMPRIME AERONAVES--------------------\n')
let exemploAeronave = new moduloAeronave.ServicoAeronaves('Aeronaves.json');
    for (let valores of exemploAeronave.todas()){
        console.log(`${valores}`);
    } 

console.log('----------FIM DO EXEMPLO AERONAVE------------\n');