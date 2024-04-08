//imports necessários//

import {validate} from "bycontract";
import nReadllines from "n-readlines";
import * as fs from 'fs';


// classe principal Aerovia//

export class Aerovia {
    #id;
    #origem;
    #destino;
    #tamanho;
    #altitudes;

    constructor(id, origem, destino, tamanho,altitudes){
        validate(arguments, [('id','string'), ('origem','string'), ('destino','string'), ('tamanho','number'), ('altitudes','array')]);

        if (id.lenght < 2 || origem == '' || destino == '' || tamanho <= 0 || altitudes == ''){
            throw new Error('Dados da aerovia inválidos');
        }

        this.#id = id;
        this.#origem = origem;
        this.#destino = destino;
        this.#tamanho = tamanho;
        this.#altitudes = altitudes;

    }

    
    get id(){
        return this.#id;
    }

    get origem(){
        return this.#origem;
    }

    get destino(){
        return this.#destino;
    }

    get tamanho(){
        return this.#tamanho;
    }

    get altitudes(){
        return this.#altitudes;
    }


    toString(){
        let str = `[id: ${this.#id}, origem: ${this.#origem}, destino: ${this.#destino}, tamanho: ${this.#tamanho} altitudes: ${this.#altitudes}]`;
        return str;
    }

    
}


// classe de serviço Aerovias//

export class ServicoAerovias {

    #aerovias;

    constructor(){
        this.#aerovias = [];
        this.lerArquivoAerovias();
    }

    // Lê o arquivo csv e cria um objeto Aerovia para cada linha do arquivo//

    lerArquivoAerovias(){
        try {
            const data = fs.readFileSync('Aerovia.json', 'utf8');
            const aeroviasJSON = JSON.parse(data);
            const aerovias = aeroviasJSON.aerovias.map(aeroviaData => {
                return new Aerovia(aeroviaData.id, aeroviaData.origem, aeroviaData.destino, aeroviaData.tamanho, aeroviaData.altitudes);
            });
            
            
            this.#aerovias.push(...aerovias);
  
          } catch (error) {
            console.error('Erro ao analisar o arquivo JSON:', error);
          }
        }

    get aerovias(){
        return this.#aerovias.values();
    }

    // Retorna as aerovias com base no aeroporto de origem e destino //

    recuperaOrigemDestino(origem, destino){
        const aeroviaEncontrada = this.#aerovias.filter(aerovia => aerovia.origem === origem && aerovia.destino === destino);
    
        if (aeroviaEncontrada) {
            return aeroviaEncontrada;
        } else {
            throw new Error('Aerovia não encontrada');
        }
    }

    todas(){
        return [...this.#aerovias];
     }

    
     recupera(id){
        validate(id, 'string');
        const aerovia = this.#aerovias.find(aerovia => aerovia.id == id);
        return aerovia;
    }



}
