// Service: decide. Valida, aplica regras de negócio e lança ErroHttp.
// Não importa express e não conhece req/res.
import * as jogadorModel from '../models/jogadorModel.js';
import * as personagemModel from '../models/personagemModel.js';
import { ErroHttp } from '../utils/erro.js';

function validar({ nome, nick }) {
  if (!nome || !nick) {
    throw new ErroHttp(400, 'Nome e nick são obrigatórios');
  }
  // Regra: nick de 3 a 20 caracteres, só letras, números e _
  if (!/^\w{3,20}$/.test(nick)) {
    throw new ErroHttp(400, 'Nick deve ter de 3 a 20 caracteres (letras, números ou _)');
  }
}

export function listar() {
  return jogadorModel.listar();
}

export function buscarPorId(id) {
  const jogador = jogadorModel.buscarPorId(id);
  if (!jogador) {
    throw new ErroHttp(404, 'Jogador não encontrado');
  }
  return jogador;
}

export function criar({ nome, nick }) {
  validar({ nome, nick });
  // Regra: nick é único (sem diferenciar maiúsculas/minúsculas)
  if (jogadorModel.buscarPorNick(nick)) {
    throw new ErroHttp(409, 'Nick já está em uso');
  }
  return jogadorModel.criar({ nome, nick });
}

export function atualizar(id, { nome, nick }) {
  buscarPorId(id);
  validar({ nome, nick });
  const outro = jogadorModel.buscarPorNick(nick);
  if (outro && outro.id !== id) {
    throw new ErroHttp(409, 'Nick já está em uso');
  }
  return jogadorModel.atualizar(id, { nome, nick });
}

export function remover(id) {
  buscarPorId(id);
  // Regra: não remove jogador que ainda tem personagens (1:N)
  if (personagemModel.listarPorJogador(id).length > 0) {
    throw new ErroHttp(409, 'Jogador possui personagens; remova-os antes');
  }
  jogadorModel.remover(id);
}
