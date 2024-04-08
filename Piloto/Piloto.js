//imports necessários//

import {validate} from "bycontract";
import nReadllines from "n-readlines";


// classe principal Piloto//

export class Piloto {
    #matricula;
    #nome;
    #habilitacaoAtiva;

    constructor(matricula, nome){
        validate(arguments, [('matricula','string'), ('nome','string')]);
        
        if (matricula.length != 3 || nome === ''){
            throw new Error('Dados do piloto inválidos');
        }
        
        this.#matricula = matricula;
        this.#nome = nome;
        this.#habilitacaoAtiva = true;

    }

    get matricula(){
        return this.#matricula;
    }

    get nome(){
        return this.#nome;
    }

    get habilitacaoAtiva(){
        return this.#habilitacaoAtiva;
    }

    desabilitarPiloto(){
        this.#habilitacaoAtiva = false;
    }

    habilitarPiloto(){
        this.#habilitacaoAtiva = true;
    }

    toString(){
        let str = `[matricula: ${this.#matricula}, nome: ${this.#nome}, habilitacaoAtiva: ${this.#habilitacaoAtiva}]`;
        return str;
    }



}

// classe de serviço Pilotos//

export class ServicoPilotos {

    #pilotos;

    constructor(nomeArquivo){
        validate(nomeArquivo, 'string');
        this.#pilotos = [];
        this.lerArquivoPilotos(nomeArquivo);
    }

    // Lê o arquivo csv e cria um objeto piloto para cada linha do arquivo //

    lerArquivoPilotos(nomeArquivo){
        validate(nomeArquivo, 'string');
        let arq = new nReadllines(nomeArquivo);
        let buf = '';
        let line = '';
        let dados = '';

        arq.next();

        while (buf = arq.next()){
            line = buf.toString('utf8');
            dados = line.split(',');
            let matricula = String(dados[0]);
            let nome = String(dados[1]);
            let piloto = new Piloto(matricula, nome);
            this.#pilotos.push(piloto);
        }
    }

    get pilotos(){
        return this.#pilotos.values();
    }

    // Retorna todos os pilotos cadastrados //

    todos(){

       return [...this.#pilotos]
    }

    // Retorna o piloto com base na matrícula ------------- TROCADO DE FIND PARA FILTER //

    recupera(matricula){
        validate(matricula, 'string');
        const pilotoEncontrado = this.#pilotos.filter(piloto => piloto.matricula === matricula);
    
        if (pilotoEncontrado) {
            return pilotoEncontrado;
        } else {
            throw new Error('Piloto não encontrado');
        }
    }

}





