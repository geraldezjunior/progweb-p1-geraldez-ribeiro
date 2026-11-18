// Service: sabe os caminhos de /clientes. Não mexe no DOM.
import { api } from '../api.js';

export const listar = () => api.get('/clientes');
export const criar = (dados) => api.post('/clientes', dados);
export const atualizar = (id, dados) => api.put(`/clientes/${id}`, dados);
export const remover = (id) => api.delete(`/clientes/${id}`);
