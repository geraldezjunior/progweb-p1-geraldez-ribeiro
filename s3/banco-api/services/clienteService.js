// Service: decide. Valida, aplica regras de negócio e lança ErroHttp.
// Não importa express e não conhece req/res.
import * as clienteModel from '../models/clienteModel.js';
import { ErroHttp } from '../utils/erro.js';

function validar({ nome, cpf }) {
  if (!nome || !cpf) {
    throw new ErroHttp(400, 'Nome e CPF são obrigatórios');
  }
  if (!/^\d{11}$/.test(cpf)) {
    throw new ErroHttp(400, 'CPF deve ter 11 dígitos numéricos');
  }
}

export function listar() {
  return clienteModel.listar();
}

export function buscarPorId(id) {
  const cliente = clienteModel.buscarPorId(id);
  if (!cliente) {
    throw new ErroHttp(404, 'Cliente não encontrado');
  }
  return cliente;
}

export function criar({ nome, cpf }) {
  validar({ nome, cpf });
  if (clienteModel.buscarPorCpf(cpf)) {
    throw new ErroHttp(409, 'CPF já cadastrado');
  }
  return clienteModel.criar({ nome, cpf });
}

export function atualizar(id, { nome, cpf }) {
  buscarPorId(id);
  validar({ nome, cpf });
  const outro = clienteModel.buscarPorCpf(cpf);
  if (outro && outro.id !== id) {
    throw new ErroHttp(409, 'CPF já cadastrado');
  }
  return clienteModel.atualizar(id, { nome, cpf });
}

export function remover(id) {
  buscarPorId(id);
  clienteModel.remover(id);
}
