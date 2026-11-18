// Controller: lê req, converte com Number(), chama o service e responde.
// Sem if de negócio e sem try/catch (o Express 5 repassa erros ao errorHandler).
import * as jogadorService from '../services/jogadorService.js';

export function listar(req, res) {
  res.json(jogadorService.listar());
}

export function buscarPorId(req, res) {
  const id = Number(req.params.id);
  res.json(jogadorService.buscarPorId(id));
}

export function criar(req, res) {
  const jogador = jogadorService.criar(req.body ?? {});
  res.status(201).json(jogador);
}

export function atualizar(req, res) {
  const id = Number(req.params.id);
  res.json(jogadorService.atualizar(id, req.body ?? {}));
}

export function remover(req, res) {
  const id = Number(req.params.id);
  jogadorService.remover(id);
  res.status(204).end();
}
