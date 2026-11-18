// main.js: só liga as partes (service <-> store <-> view). Sem fetch e sem DOM aqui.
import * as clienteService from './services/clienteService.js';
import { criarStore } from './state/store.js';
import * as clienteView from './ui/clienteView.js';

const clientes = criarStore();
clientes.subscribe(clienteView.renderizar);

async function carregarClientes() {
  clientes.set({ status: 'carregando', erro: null });
  try {
    const itens = await clienteService.listar();
    clientes.set({ itens, status: itens.length > 0 ? 'sucesso' : 'vazio' });
  } catch (erro) {
    clientes.set({ itens: [], status: 'erro', erro: erro.message });
  }
}

clienteView.ligarEventos({
  async aoSalvar(dados) {
    const { editando } = clientes.get();
    clienteView.ocupado(true);
    try {
      if (editando) {
        await clienteService.atualizar(editando.id, dados);
        clienteView.avisar(`Cliente "${dados.nome}" atualizado.`, 'success');
      } else {
        await clienteService.criar(dados);
        clienteView.avisar(`Cliente "${dados.nome}" cadastrado.`, 'success');
      }
      clientes.set({ editando: null });
      clienteView.limparFormulario();
      await carregarClientes();
    } catch (erro) {
      // 400 / 409 / 404: a mensagem é a que a API mandou em { "erro": ... }
      clienteView.avisar(erro.message, 'danger');
    } finally {
      clienteView.ocupado(false);
    }
  },

  aoEditar(id) {
    const cliente = clientes.get().itens.find((c) => c.id === id);
    clientes.set({ editando: cliente ?? null });
  },

  aoCancelar() {
    clientes.set({ editando: null });
  },

  async aoRemover(id) {
    const cliente = clientes.get().itens.find((c) => c.id === id);
    if (!confirm(`Remover o cliente "${cliente?.nome ?? id}"?`)) return;
    try {
      await clienteService.remover(id);
      clienteView.avisar('Cliente removido.', 'success');
      if (clientes.get().editando?.id === id) clientes.set({ editando: null });
      await carregarClientes();
    } catch (erro) {
      clienteView.avisar(erro.message, 'danger');
    }
  },

  aoRecarregar: carregarClientes,
});

carregarClientes();
