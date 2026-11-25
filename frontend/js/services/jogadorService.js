// Service: sabe os caminhos de /jogadores. Não mexe no DOM.
import { api } from '../api.js';

export const listar = () => api.get('/jogadores');
export const criar = (dados) => api.post('/jogadores', dados);
export const atualizar = (id, dados) => api.put(`/jogadores/${id}`, dados);
export const remover = (id) => api.delete(`/jogadores/${id}`);
