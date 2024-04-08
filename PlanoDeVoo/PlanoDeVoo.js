import { validate } from "bycontract";
import {Aerovia, ServicoAerovias} from '../Aerovia/Aerovia.js';
import {Aeronave, AeronaveParticular, AeronaveCarga, AeronaveComercial, AeronavePassageiros, ServicoAeronaves} from '../Aeronave/Aeronaves.js';
import {Piloto, ServicoPilotos} from '../Piloto/Piloto.js';
import {OcupacaoAerovia} from "../OcupacaoAerovia/OcupacaoAerovia.js";

export class PlanoDeVoo {
    #id;
    #matricPiloto;
    #prefixoAeronave;
    #data;
    #horario;
    #idAerovia;
    #altitude;
    #slots;
    #cancelado;

    constructor(id, matricPiloto, prefixoAeronave, data, horario, idAerovia, altitude, slots, cancelado){
    
        validate(arguments, [('id','string'), ('matricPiloto','string'), ('prefixoAeronave','string'), ('data','string'), ('horario', 'string'), ('idAerovia','string'), ('altitude','number'), ('slots','array'), ('cancelado','boolean')]);

        if (id.length < 4 || matricPiloto.length != 3 || prefixoAeronave.length < 4 || data == '' || horario == '' || idAerovia == '' || altitude < 25000 || altitude > 35000){
            throw new Error('Dados do plano de voo inválidos');
        }

        this.#id = id;
        this.#matricPiloto = matricPiloto;
        this.#prefixoAeronave = prefixoAeronave;
        this.#data = new Date(data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        const [hora, minutos] = horario.split(':').map(Number);
        this.#horario = `${hora}:${minutos}`;  
        this.#idAerovia = idAerovia;
        this.#altitude = altitude;
        this.#slots = slots;
        this.#cancelado = false;

    }


    get id(){
        return this.#id;
    }

    get matricPiloto(){
        return this.#matricPiloto;
    }

    get prefixoAeronave(){
        return this.#prefixoAeronave;
    }

    get data(){
        return this.#data;
    }

    get horario(){
        return this.#horario;
    }

    get idAerovia(){
        return this.#idAerovia;
    }

    get altitude(){
        return this.#altitude;
    }

    get slots(){
        return this.#slots;
    }

    set slots(slots){
        this.#slots = slots;
    }

    get cancelado(){
        return this.#cancelado;
    }

    set cancelado(cancelado){
        this.#cancelado = cancelado;
    }

    toString(){
        let str = `[id: ${this.#id}, matricPiloto: ${this.#matricPiloto}, prefixoAeronave: ${this.#prefixoAeronave}, data: ${this.#data}, horario: ${this.#horario}, idAerovia: ${this.#idAerovia}, altitude: ${this.#altitude}, slots: ${this.#slots}, cancelado: ${this.#cancelado}]`;
        return str;
    }

    toJSON () {
        return {
            id: this.#id,
            matricPiloto: this.#matricPiloto,
            prefixoAeronave: this.#prefixoAeronave,
            data: this.#data,
            horario: this.#horario,
            idAerovia: this.#idAerovia,
            altitude: this.#altitude,
            slots: this.#slots,
            cancelado: this.#cancelado
        }
    }
}



export class ServicoPlanos {

    #planos;

    constructor(){
        this.#planos = [];
    }

    adicionarPlano(plano) {
        this.#planos.push(plano.clone);
    }

    todos(){
        return [...this.#planos];
    }


}
