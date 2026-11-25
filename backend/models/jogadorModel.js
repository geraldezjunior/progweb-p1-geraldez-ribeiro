// Model: só guarda e devolve dados (agora no SQLite). Nenhuma regra aqui.
// Mesmos métodos de antes; só o "como" mudou: o array virou tabela.
// Todo valor entra na consulta com ? (nunca concatenado na string).
import { db } from '../db.js';

export function listar() {
  return db.prepare('SELECT id, nome, nick FROM jogadores ORDER BY id').all();
}

export function buscarPorId(id) {
  return db.prepare('SELECT id, nome, nick FROM jogadores WHERE id = ?').get(id);
}

export function buscarPorNick(nick) {
  // A coluna nick é COLLATE NOCASE: "Joao" e "joao" são o mesmo nick.
  return db.prepare('SELECT id, nome, nick FROM jogadores WHERE nick = ?').get(nick);
}

export function criar({ nome, nick }) {
  const r = db
    .prepare('INSERT INTO jogadores (nome, nick) VALUES (?, ?)')
    .run(nome, nick);
  return buscarPorId(r.lastInsertRowid);
}

export function atualizar(id, dados) {
  const novo = { ...buscarPorId(id), ...dados };
  db.prepare('UPDATE jogadores SET nome = ?, nick = ? WHERE id = ?')
    .run(novo.nome, novo.nick, id); // o id nunca muda
  return buscarPorId(id);
}

export function remover(id) {
  db.prepare('DELETE FROM jogadores WHERE id = ?').run(id);
}
