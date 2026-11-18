// main.js: só liga as partes (services <-> stores <-> views). Sem fetch e sem DOM aqui.
import * as jogadorService from './services/jogadorService.js';
import * as personagemService from './services/personagemService.js';
import { criarStore, estadoInicialLista } from './state/store.js';
import * as jogadorView from './ui/jogadorView.js';
import * as personagemView from './ui/personagemView.js';

const jogadores = criarStore();
const personagens = criarStore({ ...estadoInicialLista(), filtroJogadorId: null });

// ---------- Renderização ----------
// Personagens dependem de jogadores (select e nick do dono), e a tabela de
// jogadores mostra quantos personagens cada um tem: qualquer mudança redesenha as duas.

function contarPersonagens() {
  const { status, itens, filtroJogadorId } = personagens.get();
  if (filtroJogadorId || (status !== 'sucesso' && status !== 'vazio')) return null;
  const contagem = new Map();
  itens.forEach((p) => contagem.set(p.jogadorId, (contagem.get(p.jogadorId) ?? 0) + 1));
  return contagem;
}

function renderizarTudo() {
  jogadorView.renderizar(jogadores.get(), contarPersonagens());
  personagemView.renderizar(personagens.get(), jogadores.get());
}

jogadores.subscribe(renderizarTudo);
personagens.subscribe(renderizarTudo);

// ---------- Jogadores (entidade pai) ----------

async function carregarJogadores() {
  jogadores.set({ status: 'carregando', erro: null });
  try {
    const itens = await jogadorService.listar();
    jogadores.set({ itens, status: itens.length > 0 ? 'sucesso' : 'vazio' });
  } catch (erro) {
    jogadores.set({ itens: [], status: 'erro', erro: erro.message });
  }
}

jogadorView.ligarEventos({
  async aoSalvar(dados) {
    const { editando } = jogadores.get();
    jogadorView.ocupado(true);
    try {
      if (editando) {
        await jogadorService.atualizar(editando.id, dados);
        jogadorView.avisar(`Jogador "${dados.nick}" atualizado.`, 'success');
      } else {
        await jogadorService.criar(dados);
        jogadorView.avisar(`Jogador "${dados.nick}" cadastrado.`, 'success');
      }
      jogadores.set({ editando: null });
      jogadorView.limparFormulario();
      await carregarJogadores();
    } catch (erro) {
      // 400 (nick inválido) / 409 (nick em uso): mensagem que veio da API
      jogadorView.avisar(erro.message, 'danger');
    } finally {
      jogadorView.ocupado(false);
    }
  },

  aoEditar(id) {
    const jogador = jogadores.get().itens.find((j) => j.id === id);
    jogadores.set({ editando: jogador ?? null });
  },

  aoCancelar() {
    jogadores.set({ editando: null });
  },

  async aoRemover(id) {
    const jogador = jogadores.get().itens.find((j) => j.id === id);
    if (!confirm(`Remover o jogador "${jogador?.nick ?? id}"?`)) return;
    try {
      await jogadorService.remover(id);
      jogadorView.avisar('Jogador removido.', 'success');
      if (jogadores.get().editando?.id === id) jogadores.set({ editando: null });
      await carregarJogadores();
      if (personagens.get().filtroJogadorId === id) {
        personagens.set({ filtroJogadorId: null });
        await carregarPersonagens();
      }
    } catch (erro) {
      // 409: jogador ainda tem personagens
      jogadorView.avisar(erro.message, 'danger');
    }
  },

  aoRecarregar: carregarJogadores,
});

// ---------- Personagens (entidade filha: escolhe o jogador no <select>) ----------

async function carregarPersonagens() {
  personagens.set({ status: 'carregando', erro: null });
  try {
    const itens = await personagemService.listar(personagens.get().filtroJogadorId);
    personagens.set({ itens, status: itens.length > 0 ? 'sucesso' : 'vazio' });
  } catch (erro) {
    personagens.set({ itens: [], status: 'erro', erro: erro.message });
  }
}

personagemView.ligarEventos({
  async aoSalvar(dados) {
    const { editando } = personagens.get();
    personagemView.ocupado(true);
    try {
      if (editando) {
        await personagemService.atualizar(editando.id, dados);
        personagemView.avisar(`Personagem "${dados.nome}" atualizado.`, 'success');
      } else {
        await personagemService.criar(dados);
        personagemView.avisar(`Personagem "${dados.nome}" cadastrado.`, 'success');
      }
      personagens.set({ editando: null });
      personagemView.limparFormulario();
      await carregarPersonagens();
    } catch (erro) {
      // 400 (nível/classe) / 409 (nome repetido no jogador) / 422 (jogador não existe)
      personagemView.avisar(erro.message, 'danger');
    } finally {
      personagemView.ocupado(false);
    }
  },

  aoEditar(id) {
    const personagem = personagens.get().itens.find((p) => p.id === id);
    personagens.set({ editando: personagem ?? null });
  },

  aoCancelar() {
    personagens.set({ editando: null });
  },

  async aoRemover(id) {
    const personagem = personagens.get().itens.find((p) => p.id === id);
    if (!confirm(`Remover o personagem "${personagem?.nome ?? id}"?`)) return;
    try {
      await personagemService.remover(id);
      personagemView.avisar('Personagem removido.', 'success');
      if (personagens.get().editando?.id === id) personagens.set({ editando: null });
      await carregarPersonagens();
    } catch (erro) {
      personagemView.avisar(erro.message, 'danger');
    }
  },

  aoFiltrar(jogadorId) {
    personagens.set({ filtroJogadorId: jogadorId });
    carregarPersonagens();
  },

  aoRecarregar: carregarPersonagens,
});

// ---------- Início ----------
carregarJogadores();
carregarPersonagens();
