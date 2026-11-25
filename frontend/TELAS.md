# Telas do front (RPG de Turnos)

## Como rodar

1. API: `cd backend`, `npm install`, `npm run dev` (porta 3000, com CORS liberado para `http://localhost:5500` e `http://127.0.0.1:5500`).
2. Front, em outro terminal: `cd frontend` e `npx http-server -p 5500 -c-1` (ou a extensão Live Server na porta 5500).
3. Abra `http://localhost:5500`. Não abra o `index.html` com duplo clique (`file://` não carrega os módulos).

Os dados da API ficam em memória: reiniciar o backend zera as listas e os IDs.

## Camadas

| Pasta / arquivo | Papel |
|---|---|
| `js/config.js` | URL da API |
| `js/api.js` | `fetch`, JSON, 204 e erro `{ "erro": ... }` virando `ErroApi` com a mensagem da API |
| `js/services/` | `jogadorService.js` e `personagemService.js`: os caminhos de cada recurso |
| `js/state/store.js` | store genérico (`get`, `set`, `subscribe`) com `status`, `itens`, `erro` e `editando` |
| `js/ui/` | `aviso.js` (alertas) e uma view por entidade; tudo com `textContent`, nenhum `innerHTML` |
| `js/main.js` | só liga service, store e view |

## Os quatro estados de cada lista

### Lista de jogadores

| Estado | Como provocar | O que aparece |
|---|---|---|
| Carregando | DevTools (F12) > Network > throttling **Slow 4G** (ou 3G) e recarregue a página | Spinner "Carregando jogadores…" |
| Vazio | Backend recém-iniciado, sem cadastrar nada | "Nenhum jogador cadastrado ainda…" |
| Erro | Pare o backend (Ctrl+C) e clique em **Recarregar** | Alerta vermelho "Não foi possível carregar os jogadores. Não foi possível conectar à API…" com botão **Tentar de novo** |
| Sucesso | Cadastre um jogador (ex.: nome `Geraldez`, nick `geraldez_jr`) | Tabela com ID, nome, nick e quantidade de personagens |

### Lista de personagens

| Estado | Como provocar | O que aparece |
|---|---|---|
| Carregando | Mesmo throttling da Network e recarregar | Spinner "Carregando personagens…" |
| Vazio | Backend recém-iniciado; ou escolha no filtro um jogador sem personagens | "Nenhum personagem cadastrado ainda." / "Este jogador ainda não tem personagens." |
| Erro | Pare o backend e clique em **Recarregar** da lista de personagens | Alerta vermelho com a mensagem e **Tentar de novo** |
| Sucesso | Escolha um jogador no `<select>` e cadastre (ex.: `Arthos`, Guerreiro, nível 1) | Tabela com classe, nível, nick do dono e HP / MP / ATQ / DEF definidos pela classe |

Sem jogadores cadastrados, o `<select>` de jogador mostra "Cadastre um jogador primeiro" e o botão **Cadastrar** de personagem fica desabilitado.

## Erros de regra do backend na tela

Todos aparecem no alerta vermelho da seção, com a mensagem exata que a API mandou em `{ "erro": ... }`.

| Onde | Como provocar | Status | Mensagem |
|---|---|---|---|
| Jogador | Cadastrar outro jogador com o nick `GERALDEZ_JR` (mesmo nick, outra caixa) | 409 | Nick já está em uso |
| Jogador | Cadastrar com nick `ab` | 400 | Nick deve ter de 3 a 20 caracteres (letras, números ou _) |
| Jogador | **Remover** um jogador que ainda tem personagens | 409 | Jogador possui personagens; remova-os antes |
| Personagem | Cadastrar `arthos` para o mesmo jogador que já tem `Arthos` | 409 | Este jogador já tem um personagem com esse nome |
| Personagem | Cadastrar com nível `150` | 400 | Nível deve ser um inteiro entre 1 e 100 |
| Personagem | Abra duas abas; na aba A remova um jogador sem personagens; na aba B (sem recarregar) cadastre um personagem para esse jogador | 422 | Jogador informado não existe |

## Outros testes

- **XSS**: cadastre um jogador com nome `<img src=x onerror=alert(1)>`. Ele aparece como texto na tabela e no `<select>`, e nenhum alerta abre.
- **Preflight**: na aba Network, um POST/PUT/DELETE gera antes um `OPTIONS` (204) com `Access-Control-Allow-Origin: http://localhost:5500`.
- **Filtro 1:N**: o `<select>` "Todos os jogadores" da lista chama `GET /personagens?jogadorId=…`.
- **Editar**: **Editar** preenche o formulário (inclusive o jogador dono no `<select>`); **Cancelar edição** volta ao modo cadastro.
