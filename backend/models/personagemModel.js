// Model: só guarda e devolve dados (agora no SQLite). Nenhuma regra aqui.
// Mesmos métodos de antes; só o "como" mudou: o array virou tabela.
// Todo valor entra na consulta com ? (nunca concatenado na string).
import { db } from '../db.js';

// No banco: snake_case (jogador_id). No JSON da API: camelCase (jogadorId).
// O AS traduz aqui, na única camada que conhece o banco.
const COLUNAS = `id, nome, classe, nivel, hp, mp, ataque, defesa,
  jogador_id AS jogadorId`;

export function listar() {
  return db.prepare(`SELECT ${COLUNAS} FROM personagens ORDER BY id`).all();
}

export function listarPorJogador(jogadorId) {
  return db
    .prepare(`SELECT ${COLUNAS} FROM personagens WHERE jogador_id = ? ORDER BY id`)
    .all(jogadorId);
}

export function buscarPorId(id) {
  return db.prepare(`SELECT ${COLUNAS} FROM personagens WHERE id = ?`).get(id);
}

export function criar({ nome, classe, nivel, hp, mp, ataque, defesa, jogadorId }) {
  const r = db
    .prepare(`INSERT INTO personagens
                (nome, classe, nivel, hp, mp, ataque, defesa, jogador_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(nome, classe, nivel, hp, mp, ataque, defesa, jogadorId);
  return buscarPorId(r.lastInsertRowid);
}

export function atualizar(id, dados) {
  const novo = { ...buscarPorId(id), ...dados };
  db.prepare(`UPDATE personagens
                 SET nome = ?, classe = ?, nivel = ?, hp = ?, mp = ?,
                     ataque = ?, defesa = ?, jogador_id = ?
               WHERE id = ?`)
    .run(novo.nome, novo.classe, novo.nivel, novo.hp, novo.mp,
      novo.ataque, novo.defesa, novo.jogadorId, id); // o id nunca muda
  return buscarPorId(id);
}

export function remover(id) {
  db.prepare('DELETE FROM personagens WHERE id = ?').run(id);
}
