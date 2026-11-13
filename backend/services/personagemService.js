// Service: decide. Valida, aplica regras de negócio e lança ErroHttp.
// Não importa express e não conhece req/res.
import * as personagemModel from '../models/personagemModel.js';
import * as jogadorModel from '../models/jogadorModel.js';
import { ErroHttp } from '../utils/erro.js';

// Atributos base de cada classe (mesmas classes da S2: Guerreiro e Mago).
const CLASSES = {
  guerreiro: { hp: 120, mp: 30, ataque: 15, defesa: 10 },
  mago: { hp: 80, mp: 100, ataque: 20, defesa: 5 },
};

function validar({ nome, classe, nivel, jogadorId }) {
  if (!nome || !classe || jogadorId === undefined) {
    throw new ErroHttp(400, 'Nome, classe e jogadorId são obrigatórios');
  }
  // Regra: classe precisa ser uma das existentes
  if (!CLASSES[classe]) {
    throw new ErroHttp(400, `Classe inválida. Use: ${Object.keys(CLASSES).join(', ')}`);
  }
  // Regra: nível inteiro entre 1 e 100
  if (!Number.isInteger(nivel) || nivel < 1 || nivel > 100) {
    throw new ErroHttp(400, 'Nível deve ser um inteiro entre 1 e 100');
  }
  // Regra: o pai (jogador) precisa existir
  if (!jogadorModel.buscarPorId(jogadorId)) {
    throw new ErroHttp(422, 'Jogador informado não existe');
  }
}

// Regra: um jogador não pode ter dois personagens com o mesmo nome
function garantirNomeUnico(nome, jogadorId, idAtual) {
  const repetido = personagemModel
    .listarPorJogador(jogadorId)
    .find((p) => p.nome.toLowerCase() === nome.toLowerCase() && p.id !== idAtual);
  if (repetido) {
    throw new ErroHttp(409, 'Este jogador já tem um personagem com esse nome');
  }
}

export function listar(jogadorId) {
  if (jogadorId === undefined) {
    return personagemModel.listar();
  }
  return personagemModel.listarPorJogador(jogadorId);
}

export function buscarPorId(id) {
  const personagem = personagemModel.buscarPorId(id);
  if (!personagem) {
    throw new ErroHttp(404, 'Personagem não encontrado');
  }
  return personagem;
}

export function criar({ nome, classe, nivel = 1, jogadorId }) {
  validar({ nome, classe, nivel, jogadorId });
  garantirNomeUnico(nome, jogadorId);
  return personagemModel.criar({ nome, classe, nivel, ...CLASSES[classe], jogadorId });
}

export function atualizar(id, { nome, classe, nivel = 1, jogadorId }) {
  buscarPorId(id);
  validar({ nome, classe, nivel, jogadorId });
  garantirNomeUnico(nome, jogadorId, id);
  return personagemModel.atualizar(id, { nome, classe, nivel, ...CLASSES[classe], jogadorId });
}

export function remover(id) {
  buscarPorId(id);
  personagemModel.remover(id);
}
