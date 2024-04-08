import { validate } from 'bycontract';
import { readFile, writeFile } from 'fs/promises';
import fs from 'node:fs/promises';
import {Aerovia, ServicoAerovias} from '../Aerovia/Aerovia.js';
import {Aeronave, AeronaveParticular, AeronaveCarga, AeronaveComercial, AeronavePassageiros, ServicoAeronaves} from '../Aeronave/Aeronaves.js';
import {Piloto, ServicoPilotos} from '../Piloto/Piloto.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// classe principal OcupacaoAerovia//

export class OcupacaoAerovia {


    constructor(){
        this.ocupacoes = [];
    }

    ocupa(idAerovia,data,altitude,slot){
        validate(arguments, [('idAerovia','string'), ('data','string'), ('altitude','number'), ('slot','array')]);
        if (idAerovia == '' || data == '' || altitude <= 0){
            throw new Error('Dados da ocupação inválidos');
  
        }
        // Verifique se já existe alguma ocupação com as mesmas informações
        const ocupacaoExistente = this.ocupacoes.some(ocupacao => 
            ocupacao.idAerovia === idAerovia && 
            ocupacao.data === data && 
            ocupacao.altitude === altitude && 
            ocupacao.slot === slot
        );

        if (ocupacaoExistente) {
            throw new Error('Esta aerovia já está ocupada para o slot especificado.');
        }

        // Adicione uma nova ocupação
         this.ocupacoes.push({ idAerovia, data, altitude, slot });        
    



}

    libera(){

        

          }

        



    isOcupado(idAerovia,data,altitude,slot){


                // Verifica se já existe alguma ocupação com as mesmas informações
                const ocupacaoExistente = this.ocupacoes.find(ocupacao => (
                    ocupacao.idAerovia === idAerovia &&
                    ocupacao.data === data &&
                    ocupacao.altitude === altitude &&
                    ocupacao.slot === slot
                ));
        
                return !!ocupacaoExistente; // Converte para true se a ocupação existir



    
    }

    altitudesOcupadas(idAerovia,data){
        
    }

    slotsOcupados(idAerovia,data,altitude){

    }


}