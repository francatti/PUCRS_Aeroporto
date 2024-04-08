// imports //
import {Aerovia, ServicoAerovias} from '../Aerovia/Aerovia.js';
import {Aeronave, AeronaveParticular, AeronaveCarga, AeronaveComercial, AeronavePassageiros, ServicoAeronaves} from '../Aeronave/Aeronaves.js';
import {Piloto, ServicoPilotos} from '../Piloto/Piloto.js';
import promptsync from 'prompt-sync';
import {PlanoDeVoo, ServicoPlanos} from '../PlanoDeVoo/PlanoDeVoo.js';
import { validate } from 'bycontract';
import fs from 'fs/promises';


const prompt = promptsync({sigint: true});



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
        // Verifique se já existe alguma ocupação com as mesmas informações - CORRIGIDA! //
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

libera(plano) {
    const indicesParaRemover = [];
    ocupacoesAtualizadas.forEach((subarray, subarrayIndex) => {
        subarray.forEach((ocupacao, ocupacaoIndex) => {
            if (
                ocupacao.idAerovia === plano.idAerovia &&
                ocupacao.data === plano.data &&
                ocupacao.altitude === plano.altitude
                
            ) {
                indicesParaRemover.push({ subarrayIndex, ocupacaoIndex });
            }
        });
    });

    // Remover as ocupações encontradas
    indicesParaRemover.reverse().forEach(({ subarrayIndex, ocupacaoIndex }) => {
        ocupacoesAtualizadas[subarrayIndex].splice(ocupacaoIndex, 1);
    });

    // Remover subarrays vazios
    ocupacoesAtualizadas = ocupacoesAtualizadas.filter(subarray => subarray.length > 0);

    console.log('Ocupações liberadas com sucesso');
}



    // VERIFICAR SE A AEROVIA ESTÁ OCUPADA OU NÃO - corrigida //
    async isOcupada(idAerovia, data, altitude, slots) {
        try {
        const ocupacoesJSON = await fs.readFile('ocupacoesMenu.json', 'utf8');
        const ocupacoes = JSON.parse(ocupacoesJSON);
    
        for (const ocupacoesAerovia of ocupacoes) {
            for (const ocupacao of ocupacoesAerovia) {
            if (
                ocupacao.idAerovia === idAerovia &&
                ocupacao.data === data &&
                ocupacao.altitude === altitude &&
                slots.some(s => ocupacao.slot.includes(s))
            ) {
                return true; // Se pelo menos uma condição for verdadeira, a ocupação existe e está ocupada
            }
            }
        }
        } catch (err) {
        console.error(err);
        }
    
        return false; // Se nenhum dos critérios for atendido, a ocupação não existe
    }

 // VERIFICAR ALTITUDES OCUPADAS - corrigida //
    async altitudesOcupadas(idAerovia, data) {
        try {
            const ocupacoesJSON = await fs.readFile('ocupacoesMenu.json', 'utf8');
            const ocupacoes = JSON.parse(ocupacoesJSON);
            
            const altitudesEncontradas = [];
    
            for (const ocupacoesAerovia of ocupacoes) {
                for (const ocupacao of ocupacoesAerovia) {
                    if (ocupacao.idAerovia === idAerovia && ocupacao.data === data) {
                        altitudesEncontradas.push(ocupacao.altitude);
                    }
                }
            }
    
            if (altitudesEncontradas.length === 0) {
                return 'Não há altitudes ocupadas para a data especificada';
            }
    
            return altitudesEncontradas;
        } catch (err) {
            console.error(err);
        }
    }     
    
// VERIRICAR SLOTS OCUPADOS - corrigida //
    async slotsOcupados(idAerovia, data, altitude) {
        try {
            const ocupacoesJSON = await fs.readFile('ocupacoesMenu.json', 'utf8');
            const ocupacoes = JSON.parse(ocupacoesJSON);
            
            const slotsEncontrados = [];
    
            for (const ocupacoesAerovia of ocupacoes) {
                for (const ocupacao of ocupacoesAerovia) {
                    if (ocupacao.idAerovia === idAerovia && ocupacao.data === data && ocupacao.altitude === altitude) {
                        for (const slot of ocupacao.slot) {
                            slotsEncontrados.push(slot);
                        }
                    }
                }
            }
    
            if (slotsEncontrados.length === 0) {
                return 'Não há slots ocupados para a data e altitude especificadas';
            }
    
            return slotsEncontrados;
        } catch (err) {
            console.error(err);
        }
    }     
    
    }





// FUNÇÕES E COMANDOS PARA LEITURA E SALVAMENTO DOS DADOS + INICIALIZAÇÃO //

const ocupacaoAerovia = new OcupacaoAerovia();


async function salvarOcupacoes(ocupacoesAtualizadas, nomeArquivo){
    if (ocupacaoAerovia.ocupacoes.length != 0) {
    const json = JSON.stringify(ocupacoesAtualizadas);
    fs.writeFile(nomeArquivo, json);
    console.log('Ocupações salvas com sucesso')
    } else {
        console.log('Não há ocupações para salvar');
        }
}

async function lerOcupacoes(nomeArquivo){
    const json = await fs.readFile(nomeArquivo);
    const ocupacoesMenu = JSON.parse(json);
    return ocupacoesMenu;
}

async function salvarPlanos(planosAtualizados, nomeArquivo) {
    if (planosAprovados.length != 0) {
    const json = JSON.stringify(planosAtualizados);
    fs.writeFile(nomeArquivo, json);
    console.log('Planos de voo aprovados salvos com sucesso')
    } else {
    console.log('Não há planos de voo aprovados para salvar');
    }
}

// função adicionada para salvar ocupações caso sejam canceladas - corrigida //

async function salvarOcupacaoCancelada(ocupacoesAtualizadas, nomeArquivo) {
    try {
        // Leia o conteúdo atual do arquivo
        const ocupacoesJSON = await fs.readFile(nomeArquivo, 'utf8');
        const ocupacoesExistentes = JSON.parse(ocupacoesJSON);

        // Atualize as ocupações
        ocupacoesExistentes.splice(0, ocupacoesExistentes.length, ...ocupacoesAtualizadas);

        // Salve o conteúdo atualizado no arquivo
        const json = JSON.stringify(ocupacoesExistentes);
        await fs.writeFile(nomeArquivo, json);

        console.log('Ocupações atualizadas salvas com sucesso');
    } catch (error) {
        console.error('Erro ao salvar ocupações atualizadas:', error);
    }
}

// função adicionada para salvar planos caso sejam cancelados - corrigida //
async function salvarPlanoCancelado(idCancelar, nomeArquivo) {
    try {
        // Verifique se o arquivo existe
        await fs.access(nomeArquivo);

        // Leia os dados do arquivo existente
        const arquivo = await fs.readFile(nomeArquivo, 'utf-8');
        let dadosExistentes = JSON.parse(arquivo);

        // Percorra todos os planos para encontrar o plano a ser cancelado
        let planoEncontrado = false;

        for (const planoArray of dadosExistentes) {
            const index = planoArray.findIndex((plano) => plano.id === idCancelar);

            if (index !== -1) {
                // Defina a propriedade 'cancelado' como true no plano existente
                planoArray[index].cancelado = true;
                planoEncontrado = true;
                break;
            }
        }

        if (planoEncontrado) {
            // Salve os planos atualizados no arquivo
            await fs.writeFile(nomeArquivo, JSON.stringify(dadosExistentes, null, 2));

            console.log('Plano cancelado e atualizado com sucesso');
        } else {
            console.log('Plano com o ID especificado não encontrado');
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Arquivo não encontrado:', nomeArquivo);
        } else {
            console.error('Erro ao salvar os planos atualizados:', error);
        }
    }
}


async function lerPlanos(nomeArquivo) {
    const json = await fs.readFile(nomeArquivo);
    const planoMenu = JSON.parse(json);
    return planoMenu;
}

async function inicializarPlanos(){
    try{
        let planosLidos = await lerPlanos('planoMenu.json');
        console.log('Sistema inicializado e planos anteriores lidos com sucesso!')
        return planosLidos;
    } catch {
        console.log(error.message);
        
    }
}

async function inicializarOcupacoes(){
    try{
        let ocupacoesLidas = await lerOcupacoes('ocupacoesMenu.json');
        console.log('Sistema inicializado e ocupações anteriores lidas com sucesso!')
        return ocupacoesLidas;
    } catch {
        console.log(error.message);

    }
}

const planosIniciais = await inicializarPlanos();

const ocupacoesIniciais = await inicializarOcupacoes();




const planosAprovados = [];


// FUNÇÕES PARA LÓGICA DE CONSISTÊNCIA DOS DADOS INSERIDOS PELO USUÁRIO NO PROMPT - corrigido //

function isDataFormatoValido(data) {
    // Expressão regular para verificar o formato "dd/mm/ano"
    const formatoDataRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    // Testa se a data corresponde ao formato
    return formatoDataRegex.test(data);
}

function isDataValida(data) {
    
// Divide a data inserida em dia, mês e ano
const partesData = data.split('/');
    
// Verifica se a data tem o formato correto (DD/MM/YYYY) e se os valores são numéricos
if (partesData.length === 3 && !isNaN(partesData[0]) && !isNaN(partesData[1]) && !isNaN(partesData[2])) {
    const dia = parseInt(partesData[0]);
    const mes = parseInt(partesData[1]) - 1; // O mês é base 0 (janeiro = 0, fevereiro = 1, etc.)
    const ano = parseInt(partesData[2]);
    
    // Cria um objeto Date com a data inserida
    const dataInseridaObj = new Date(ano, mes, dia);
    
    // Obtém a data atual
    const dataAtual = new Date();
    
    // Verifica se a data inserida é válida e não é anterior à data atual
    if (!isNaN(dataInseridaObj) && dataInseridaObj >= dataAtual) {
        return true; // A data é válida e não é anterior à data atual
    }
}

    return false; // A data não é válida ou é anterior à data atual
}


function isHorarioFormatoValido(horario) {
    // Expressão regular para verificar o formato "HH:MM"
    const formatoHorarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    // Testa se o horário corresponde ao formato
    return formatoHorarioRegex.test(horario);
}


// Função para verificar se um ID de aerovia existe
function verificaIDAerovia(idAeroviaPlano) {
    const servicoAerovias = new ServicoAerovias();
    servicoAerovias.lerArquivoAerovias();
    const aerovia = servicoAerovias.recupera(idAeroviaPlano);
    if (aerovia == undefined) {
        throw new Error('ID da aerovia inválido');
    } else {    
        return true;
    }
}



// Função para verificar se uma matrícula de piloto existe no arquivo CSV de forma síncrona
function verificaMatricula(matriculaPlano) {
    const servicoPilotos = new ServicoPilotos('Pilotos.csv');
    servicoPilotos.lerArquivoPilotos('Pilotos.csv')
    const piloto = servicoPilotos.recupera(matriculaPlano);
    if (piloto == '') {
        throw new Error('Matrícula do piloto inválida');
    } else {    
        return true;
    }
  }

// Função para verificar se um prefixo de aeronave existe
function verificaPrefixo(prefixoPlano) {
    const servicoAeronaves = new ServicoAeronaves();
    servicoAeronaves.lerArquivoAeronaves();
    const aeronave = servicoAeronaves.recupera(prefixoPlano);
    if (aeronave == undefined) {
        throw new Error('Prefixo da aeronave inválido');
    } else {    
        return true;
    }
  }

// Função para verificar se os slots estão no formato correto 

function validarSlots(slotsStr) {
    // Padrão para validar slots no formato "HH:mm,HH:mm"
    const regex = /^([01]\d|2[0-3]):([0-5]\d),([01]\d|2[0-3]):([0-5]\d)$/;

    if (regex.test(slotsStr)) {
        // A entrada está no formato correto
        return true;
    } else {
        // A entrada está no formato incorreto
        return false;
    }
}


// Função para aprovar plano de voo - corrigida //

function aprovarPlanoDeVoo() {
            
            let idPlano = prompt('Entre com o id do plano de voo: ')
            if (idPlano.length < 4 ){
                throw new Error('ID do plano de voo inválido');
            }

            let matriculaPlano = prompt('Entre com a matrícula do piloto: ')
            verificaMatricula(matriculaPlano);

            let prefixoPlano = prompt('Entre com o prefixo da aeronave: ')
            verificaPrefixo(prefixoPlano);

            
            let dataPlano = prompt('Entre com a data do voo: ')
            if (!isDataFormatoValido(dataPlano) || !(isDataValida(dataPlano))) {
                throw new Error('Data do voo inválida');
            }
            let horarioPlano = prompt('Entre com o horário do voo: ')
            if (!isHorarioFormatoValido(horarioPlano)) {
                throw new Error('Horário do voo inválido');
            }
            let idAeroviaPlano = prompt('Entre com o id da aerovia: ')
            verificaIDAerovia(idAeroviaPlano);

            let altitudePlano = parseInt(prompt('Entre com a altitude do voo: '))
            if (altitudePlano < 25000 || altitudePlano > 35000) {
                throw new Error('Altitude do voo inválida');
            }


               function calcularSlots(){
                
                const servicoAerovias = new ServicoAerovias();
                servicoAerovias.lerArquivoAerovias();
                const aerovia = servicoAerovias.recupera(idAeroviaPlano);
                const aeroviaTamanho = aerovia.tamanho;
            
                
        
                const servicoAeronaves = new ServicoAeronaves();
                servicoAeronaves.lerArquivoAeronaves();
                const aeronave = servicoAeronaves.recupera(prefixoPlano);
                const aeronaveVelocidade = aeronave.velocidadeCruzeiro;
        
                
        
                const tempoViagemHoras = aeroviaTamanho / aeronaveVelocidade;
                
                const slotsNecessarios = Math.ceil(tempoViagemHoras);
                let slots = [horarioPlano];
                const [hora, minutos] = horarioPlano.split(':').map(Number);
                
                for (let i = 0; i < slotsNecessarios; i++) {
                  let novoMinuto = minutos + (i + 1) * 60;
                  let novaHora = hora;
                
                  while (novoMinuto >= 60) {
                    novoMinuto -= 60;
                    novaHora++;
                  }
                
                  const novoHorario = `${novaHora.toString().padStart(2, '0')}:${novoMinuto.toString().padStart(2, '0')}`;
                
                  slots.push(novoHorario);
                }
                let slotsPlano = [...slots];
                return slotsPlano
            }

            let slots = calcularSlots();
            let slotsPlano = slots;

   
            let plano = new PlanoDeVoo(idPlano,matriculaPlano,prefixoPlano,dataPlano,horarioPlano,idAeroviaPlano,altitudePlano,slotsPlano,false);

            function verificarHabilitacaoPiloto() {
                const servicoPilotos = new ServicoPilotos('Pilotos.csv');
                servicoPilotos.lerArquivoPilotos('Pilotos.csv');
                const piloto = servicoPilotos.recupera(plano.matricPiloto);
                if (piloto.habilitacaoAtiva){
                    return true;
                } else {
                    return false;
                }
              }      

            function verificarAutonomiaAeronave() {
               const servicoAeronaves = new ServicoAeronaves();
               servicoAeronaves.lerArquivoAeronaves();
               const aeronave = servicoAeronaves.recupera(plano.prefixoAeronave);
               const aeronaveAutonomia = aeronave.autonomia;
           
       
               const servicoAerovias = new ServicoAerovias();
               servicoAerovias.lerArquivoAerovias();
               const aerovia = servicoAerovias.recupera(plano.idAerovia);
               const aeroviaTamanho = aerovia.tamanho;
               
               const autonomiaNecessaria = aeroviaTamanho * 1.1;
       
               if (aeronaveAutonomia >= autonomiaNecessaria) {
                   return true;
               } 
             }
           
             // Simular verificação de altitude compatível com a aeronave
            function verificarAltitudeAeronave() {
       
               
               const servicoAeronaves = new ServicoAeronaves();
               servicoAeronaves.lerArquivoAeronaves();
               const tipoAeronave = servicoAeronaves.getTipoAeronave(plano.prefixoAeronave);
       
               
               if (tipoAeronave =="AeronavePassageiros" && plano.altitude <= 28000) {
                   return false; // Altitude incompatível
                 }
               
               if (tipoAeronave =='AeronaveParticular' && (plano.altitude < 25000 || plano.altitude > 27000)) {
                   return false; // Altitude incompatível  
               }
       
               if (tipoAeronave =='AeronaveCarga' && plano.horario < '00:00' && plano.horario > '06:00') {
                   return false; // Altitude incompatível  
               }
       
       
               return true; // Supondo que a altitude seja compatível
             }
           
            
            async function aprovarPlanoDeVoo(plano) {
                // Simule as condições para aprovação
                const habilitacaoAtiva = verificarHabilitacaoPiloto();
                const autonomiaSuficiente = verificarAutonomiaAeronave();
                const altitudeCompativel = verificarAltitudeAeronave();
                const ocupada = await ocupacaoAerovia.isOcupada(idAeroviaPlano, dataPlano, altitudePlano, slotsPlano);
            
                // Todas as condições devem ser verdadeiras para aprovação
                

                if (habilitacaoAtiva && autonomiaSuficiente && altitudeCompativel && !ocupada) {
                    console.log('Plano de voo aprovado com id:' + plano.id);
                    planosAprovados.push(plano);
                    console.log(plano.toString())
                    ocupacaoAerovia.ocupa(idAeroviaPlano, dataPlano, altitudePlano, slotsPlano);
                    return console.log(ocupacaoAerovia.ocupacoes);
                }
              }

            
              async function iniciar() {
                verificarHabilitacaoPiloto();
                verificarAltitudeAeronave();
                verificarAutonomiaAeronave();
            
                const planoAprovado = await aprovarPlanoDeVoo(plano);
                if (!planoAprovado) {
                    console.log('Plano de voo reprovado com id:' + plano.id + '\n');
                }
            }
            
            iniciar().catch((error) => {
                
                console.error(error);
            });
        
            
}

const planosAtualizados = [...planosIniciais, planosAprovados];
let ocupacoesAtualizadas = [...ocupacoesIniciais, ocupacaoAerovia.ocupacoes];

//////////////////////////////////// FUNÇÕES DO MENU DO NODE /////////////////////////////////////////////////////


function listarAerovias() {
    let exemploAerovia = new ServicoAerovias('Aerovias.json');
    let origem = prompt('Entre com o aeroporto de origem (POA, FLO, CWB, GRU): ')
    let destino = prompt('Entre com o aeroporto de destino (GRU, CWB, FLO, POA): ')

    if (origem != 'POA' && origem != 'FLO' && origem != 'CWB' && origem != 'GRU') {
        throw new Error('Aeroporto de origem inválido');
    }

    if (destino != 'POA' && destino != 'FLO' && destino != 'CWB' && destino != 'GRU') {
        throw new Error('Aeroporto de destino inválido');
    }


    try {

        const aeroviasAeroportos = exemploAerovia.recuperaOrigemDestino(origem, destino);
        console.log(aeroviasAeroportos.toString()); 
    } catch (error) {
        console.error(error.message); 
    }

}


function listarPlanos (){

    let id = prompt('Entre com o ID do plano de voo: ');

        // Verifique se o ID é um número válido
    if (id === undefined || isNaN(id)) {
        throw new Error('ID do plano de voo inválido');
    }

        // Iterar pelos subarrays e objetos do array de planos

    planosAtualizados.forEach(subarray => {
        subarray.forEach(plano => {
            if (plano.id == id) {
                console.log(plano);
            }
        });
      });

}


function listarPlanosData (){

    let data = prompt('Entre com a data do plano de voo no formato dd/mm/yyyy: ')

    // Iterar pelos subarrays e objetos do array de planos
    planosAtualizados.forEach(subarray => {
        subarray.forEach(plano => {
            if (plano.data == data) {
                console.log(plano);
            }
        });
      });

}

function listarOcupacao() {

    let data = prompt('Entre com a data da ocupação no formato dd/mm/yyyy: ')

    // Iterar pelos subarrays e objetos do array de ocupações
    ocupacoesAtualizadas.forEach(subarray => {
        subarray.forEach(ocupacao => {
            if (ocupacao.data == data) {
                console.log(ocupacao);
            }
        });
      });


}

// FUNÇÃO PARA CANCELAR PLANO DE VOO - corrigida //

// Função para cancelar um plano por ID
function cancelarPlano(idCancelar) {
    // Verificar se o ID fornecido está presente nos planos atualizados
    let planoEncontrado = false;

    for (const subarray of planosAtualizados) {
        for (const plano of subarray) {
            if (plano.id === idCancelar && !plano.cancelado) {
                planoEncontrado = true;
                break;
            }
        }
        if (planoEncontrado) {
            break;
        }
    }

    if (planoEncontrado) {
        // Realizar o cancelamento do plano aqui
        for (const subarray of planosAtualizados) {
            for (const plano of subarray) {
                if (plano.id === idCancelar) {
                    plano.cancelado = true; // Definir a propriedade 'cancelado' como true
                    console.log(plano);
                    ocupacaoAerovia.libera(plano, ocupacoesAtualizadas);
                    console.log('Plano de voo cancelado com sucesso');
                    return true; // Indicar que o cancelamento foi bem-sucedido
                }
            }
        }
    } else {
        console.log('ID do plano de voo não encontrado.');
        return false; // Indicar que o cancelamento não foi bem-sucedido
    }
}
// FUNÇÃO PARA LISTAR AS ALTITUDES LIVRES - corrigida //

async function listarAltitudesLivres(idAerovia, slots) {
    try {
        const ocupacoesJSON = await fs.readFile('ocupacoesMenu.json', 'utf8');
        const ocupacoes = JSON.parse(ocupacoesJSON);
        
        const altitudesOcupadas = [];

        for (const ocupacoesAerovia of ocupacoes) {
            for (const ocupacao of ocupacoesAerovia) {
                if (ocupacao.idAerovia === idAerovia && slots.every(slot => ocupacao.slot.includes(slot))) {
                    altitudesOcupadas.push(ocupacao.altitude);
                }
            }
        }

        const altitudesLivres = [];
        for (let i = 25000; i <= 35000; i += 1000) {
            if (!altitudesOcupadas.includes(i)) {
                altitudesLivres.push(i);
            }
        }

        return altitudesLivres;
    } catch (err) {
        console.error(err);
        return [];
    }
}





/////////////////// MENU ///////////////////////



async function main() {
    let terminou = false;

    while (!terminou) {
        console.log("Opções:");
        console.log("<1> - Listar aerovias ");
        console.log("<2> - Listar altitudes livres");
        console.log("<3> - Aprovar plano de voo");
        console.log("<4> - Listar planos de voo por ID");
        console.log("<5> - Listar planos por data");
        console.log("<6> - Listar ocupação aerovia por data");
        console.log("<7> - Cancelar plano de voo");
        console.log("<8> - Encerrar");
        let opcao = prompt("Entre sua opção: ");

        switch (opcao) {
            case '1': {
                listarAerovias();
                continue;
            }
            case '2': {
                try {
                    let idAerovia = prompt('Entre com o ID da aerovia: ');
                    
                    let slots = prompt('Entre com os slots: ');
                  
                    const slotsArray = slots.split(',').map(s => s.trim());

                    if (verificaIDAerovia(idAerovia) && validarSlots(slots)) {
                    const altitudes = await listarAltitudesLivres(idAerovia, slotsArray);
                    console.log('Altitudes livres:', altitudes);
                    } else {
                        console.log('Dados inválidos, tente novamente');
                    }
                } catch (error) {
                    console.error('Erro ao buscar altitudes livres:', error);
                }
                continue;
            }
            case '3': {
                aprovarPlanoDeVoo();
                continue;
            }
            case '4': {
                listarPlanos();
                continue;
            }
            case '5': {
                listarPlanosData();
                continue;
            }
            case '6': {
                listarOcupacao();
                continue;
            }
            case '7': {
                let idCancelar = prompt('Entre com o ID do plano de voo: ');
                if (cancelarPlano(idCancelar)) {
                    await salvarPlanoCancelado(idCancelar, 'planoMenu.json')
                    await salvarOcupacaoCancelada(ocupacoesAtualizadas, 'ocupacoesMenu.json')
                } else {
                    console.log('O cancelamento do plano não foi bem-sucedido, portanto, nada será salvo.');
                }
                continue;
            }
            case '8': {
                try {
                    await salvarPlanos([...planosAtualizados], 'planoMenu.json');
                    await salvarOcupacoes([...ocupacoesAtualizadas], 'ocupacoesMenu.json');
                } catch (error) {
                    console.log(error.message);
                }
                terminou = true;
                break; // Encerre o loop while
            }
        }
    }
}

main().catch(error => console.error('Erro no programa principal:', error));
