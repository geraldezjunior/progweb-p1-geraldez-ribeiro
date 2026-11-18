// State: guarda o estado de uma tela e avisa quem estiver ouvindo quando ele muda.
// Genérico: serve para qualquer entidade.
//
// Estado de uma lista:
//   status:   'carregando' | 'vazio' | 'erro' | 'sucesso'
//   itens:    o que veio da API
//   erro:     mensagem quando status === 'erro'
//   editando: item que está no formulário (null = criando um novo)

export function estadoInicialLista() {
  return { status: 'carregando', itens: [], erro: null, editando: null };
}

export function criarStore(estadoInicial = estadoInicialLista()) {
  let estado = { ...estadoInicial };
  const ouvintes = new Set();

  return {
    get() {
      return estado;
    },
    set(mudancas) {
      estado = { ...estado, ...mudancas };
      ouvintes.forEach((ouvinte) => ouvinte(estado));
    },
    // Chama o ouvinte agora e a cada mudança. Devolve a função para cancelar.
    subscribe(ouvinte) {
      ouvintes.add(ouvinte);
      ouvinte(estado);
      return () => ouvintes.delete(ouvinte);
    },
  };
}
