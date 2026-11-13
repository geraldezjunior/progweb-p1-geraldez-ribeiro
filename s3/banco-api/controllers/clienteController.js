// Controller: lê req, converte com Number(), chama o service e responde.
// Sem if de negócio e sem try/catch (o Express 5 repassa erros ao errorHandler).
import * as clienteService from '../services/clienteService.js';

export function listar(req, res) {
  res.json(clienteService.listar());
}

export function buscarPorId(req, res) {
  const id = Number(req.params.id);
  res.json(clienteService.buscarPorId(id));
}

export function criar(req, res) {
  const cliente = clienteService.criar(req.body ?? {});
  res.status(201).json(cliente);
}

export function atualizar(req, res) {
  const id = Number(req.params.id);
  res.json(clienteService.atualizar(id, req.body ?? {}));
}

export function remover(req, res) {
  const id = Number(req.params.id);
  clienteService.remover(id);
  res.status(204).end();
}
