// Controller: lê req, converte com Number(), chama o service e responde.
// Sem if de negócio e sem try/catch (o Express 5 repassa erros ao errorHandler).
import * as personagemService from '../services/personagemService.js';

// GET /personagens e GET /personagens?jogadorId=1
export function listar(req, res) {
  const { jogadorId } = req.query;
  res.json(personagemService.listar(jogadorId === undefined ? undefined : Number(jogadorId)));
}

export function buscarPorId(req, res) {
  const id = Number(req.params.id);
  res.json(personagemService.buscarPorId(id));
}

export function criar(req, res) {
  const personagem = personagemService.criar(req.body ?? {});
  res.status(201).json(personagem);
}

export function atualizar(req, res) {
  const id = Number(req.params.id);
  res.json(personagemService.atualizar(id, req.body ?? {}));
}

export function remover(req, res) {
  const id = Number(req.params.id);
  personagemService.remover(id);
  res.status(204).end();
}
