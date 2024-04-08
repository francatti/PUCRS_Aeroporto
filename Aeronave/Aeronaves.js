//imports necessários//

import {validate} from "bycontract";
import * as fs from 'fs';

// classe principal Aeronave//

export class Aeronave {
    #prefixo;
    #velocidadeCruzeiro;
    #autonomia;

    constructor(prefixo, velocidadeCruzeiro, autonomia){
        validate(arguments, [('prefixo','string'), ('velocidadeCruzeiro','number'), ('autonomia','number')]);
        
        if (prefixo.lenght < 4 || velocidadeCruzeiro <= 0 || autonomia <= 0){
            throw new Error('Dados da aeronave inválidos');
        }
        
        this.#prefixo = prefixo;
        this.#velocidadeCruzeiro = velocidadeCruzeiro;
        this.#autonomia = autonomia;
    }

    get prefixo(){
        return this.#prefixo;
    }

    get velocidadeCruzeiro(){    
        return this.#velocidadeCruzeiro;
    }

    get autonomia(){
        return this.#autonomia;
    }

    getTipoAeronave() {
        return 'Aeronave';
      }

    toString(){
        let str = `Aeronave - prefixo: ${this.#prefixo}, velocidadeCruzeiro: ${this.#velocidadeCruzeiro}, autonomia: ${this.#autonomia}`;
        return str;
    }

}


// subclasse de Aeronave - AeronaveParticular//

export class AeronaveParticular extends Aeronave {

    #respmanutencao;

    constructor(prefixo, velocidadeCruzeiro, autonomia, respmanutencao){
        validate(arguments, [('prefixo','string'), ('velocidadeCruzeiro','number'), ('autonomia','number'), ('respmanutencao','string')]);
       
        super(prefixo, velocidadeCruzeiro, autonomia);
        
        if (respmanutencao == ''){
            throw new Error('Nome da empresa inválido!');
        }
        
        this.#respmanutencao = respmanutencao;
    }

    get respmanutencao(){
        return this.#respmanutencao;
    }

    getTipoAeronave() {
        return 'AeronaveParticular';
        }

    toString(){
        return `Aeronave Particular - ${super.toString()}, respmanutencao: ${this.#respmanutencao}`;

    }

}


// subclasse de Aeronave - AeronaveComercial//

export class AeronaveComercial extends Aeronave {

    #nomeCIA;

    constructor(prefixo, velocidadeCruzeiro, autonomia, nomeCIA){
        validate(arguments, [('prefixo','string'), ('velocidadeCruzeiro','number'), ('autonomia','number'), ('nomeCIA','string')]);
        
        super(prefixo, velocidadeCruzeiro, autonomia);
        
        if (nomeCIA == ''){
            throw new Error('Nome da companhia inválido!');
        }
        
        this.#nomeCIA = nomeCIA;
    }

    get nomeCIA(){
        return this.#nomeCIA;
    }

    getTipoAeronave() {
        return 'AeronaveComercial';
        }


    toString(){
        return `Aeronave Comercial - ${super.toString()}, nomeCIA: ${this.nomeCIA}`;

    }

}

// subclasse de Aeronave - AeronavePassageiros//


export class AeronavePassageiros extends AeronaveComercial{

    #maxPassageiros;

    constructor(prefixo, velocidadeCruzeiro, autonomia, nomeCIA, maxPassageiros){
        validate(arguments, [('prefixo','string'), ('velocidadeCruzeiro','number'), ('autonomia','number'), ('nomeCIA','string'), ('maxPassageiros','number')]);

        super(prefixo, velocidadeCruzeiro, autonomia, nomeCIA);

        if (maxPassageiros <= 0){
            throw new Error('Quantidade de passageiros inválida!');
        }

        this.#maxPassageiros = maxPassageiros;
    }

    get maxPassageiros(){
        return this.#maxPassageiros;
    }

    getTipoAeronave() {
        return 'AeronavePassageiros';
        }

    toString(){
        return `Aeronave de Passageiros - ${super.toString()}, maxPassageiros: ${this.maxPassageiros}`;

    }
}


// subclasse de Aeronave - AeronaveCarga//


export class AeronaveCarga extends AeronaveComercial{

    #pesoMax;

    constructor(prefixo, velocidadeCruzeiro, autonomia, nomeCIA, pesoMax){
        validate(arguments, [('prefixo','string'), ('velocidadeCruzeiro','number'), ('autonomia','number'), ('nomeCIA','string'), ('pesoMax','number')]);

        super(prefixo, velocidadeCruzeiro, autonomia, nomeCIA);

        if (pesoMax <= 0){
            throw new Error('Peso máximo inválido!');
        }

        this.#pesoMax = pesoMax;
    }

    get pesoMax(){
        return this.#pesoMax;
    }

    getTipoAeronave() {
        return 'AeronaveCarga';
        }
    

    toString(){
        return `Aeronave de Carga - ${super.toString()}, pesoMax: ${this.pesoMax} toneladas`;

    }


}


// classe de serviço Aeronaves//


 export class ServicoAeronaves {

    #aeronaves;

    constructor(){
        this.#aeronaves = [];
        this.lerArquivoAeronaves();
    }

    // Lê o arquivo JSON e cria as instâncias de aeronaves //
    lerArquivoAeronaves() {
        
        try {
          const data = fs.readFileSync('Aeronaves.json', 'utf8');
          const aeronavesJSON = JSON.parse(data);
          const aeronaves = aeronavesJSON.aeronaves.map(aeronaveData => {
            if ('maxPassageiros' in aeronaveData) {
              return new AeronavePassageiros(aeronaveData.prefixo, aeronaveData.velocidadeCruzeiro, aeronaveData.autonomia, aeronaveData.nomeCIA, aeronaveData.maxPassageiros);
            } else if ('pesoMax' in aeronaveData) {
              return new AeronaveCarga(aeronaveData.prefixo, aeronaveData.velocidadeCruzeiro, aeronaveData.autonomia, aeronaveData.nomeCIA, aeronaveData.pesoMax);
            } else if ('respmanutencao' in aeronaveData) {
              return new AeronaveParticular(aeronaveData.prefixo, aeronaveData.velocidadeCruzeiro, aeronaveData.autonomia, aeronaveData.respmanutencao);
            } else if ('nomeCIA' in aeronaveData) {
              return new AeronaveComercial(aeronaveData.prefixo, aeronaveData.velocidadeCruzeiro, aeronaveData.autonomia, aeronaveData.nomeCIA);
            } else {
              return new Aeronave(aeronaveData.prefixo, aeronaveData.velocidadeCruzeiro, aeronaveData.autonomia);
            }
          });
          
          
          this.#aeronaves.push(...aeronaves);

        } catch (error) {
          console.error('Erro ao analisar o arquivo JSON:', error);
        }
      }

    get aeronaves(){
        return this.#aeronaves.values();
    }

    // Retorna todas as aeronaves //

    todas(){
       return [...this.#aeronaves];
    }

    recupera(prefixo){
        validate(prefixo, 'string');
        const aeronave = this.#aeronaves.find(aeronave => aeronave.prefixo == prefixo);
        return aeronave;
    }

    getTipoAeronave(prefixo) {
    
        const aeronave = this.#aeronaves.filter(aeronave => aeronave.prefixo == prefixo);
        return aeronave[0].getTipoAeronave();
        }

    }

