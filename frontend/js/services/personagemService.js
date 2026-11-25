// Service: sabe os caminhos de /personagens. Não mexe no DOM.
import { api } from '../api.js';

// Sem jogadorId lista todos; com jogadorId usa o filtro 1:N da API.
export const listar = (jogadorId) =>
  api.get(jogadorId ? `/personagens?jogadorId=${encodeURIComponent(jogadorId)}` : '/personagens');
export const criar = (dados) => api.post('/personagens', dados);
export const atualizar = (id, dados) => api.put(`/personagens/${id}`, dados);
export const remover = (id) => api.delete(`/personagens/${id}`);
