# Testes da API do RPG (Thunder Client)

Como rodar: `cd backend`, `npm install`, `npm run dev`. A API sobe em `http://localhost:3000`.

Os dados ficam em memória, então os IDs abaixo valem para um servidor **recém-iniciado** e para as requisições feitas **nesta ordem**. Toda requisição com body usa o header `Content-Type: application/json`.

| #  | Método | URL | Body | Status obtido | Resposta / o que testa |
|----|--------|-----|------|---------------|------------------------|
| 1  | POST   | `/jogadores` | `{"nome":"Geraldez","nick":"geraldez_jr"}` | **201** | Cria o jogador `id: 1` |
| 2  | POST   | `/jogadores` | `{"nome":"Outro","nick":"GERALDEZ_JR"}` | **409** | `{"erro":"Nick já está em uso"}`: nick único, sem diferenciar maiúsculas |
| 3  | POST   | `/jogadores` | `{"nome":"Curto","nick":"ab"}` | **400** | `{"erro":"Nick deve ter de 3 a 20 caracteres (letras, números ou _)"}` |
| 4  | GET    | `/jogadores` | — | **200** | Lista com 1 jogador |
| 5  | GET    | `/jogadores/1` | — | **200** | Busca por id |
| 6  | GET    | `/jogadores/99` | — | **404** | `{"erro":"Jogador não encontrado"}` |
| 7  | POST   | `/personagens` | `{"nome":"Arthos","classe":"guerreiro","jogadorId":1}` | **201** | Cria o personagem `id: 1` com nível 1 e os atributos do guerreiro (hp 120, mp 30, ataque 15, defesa 10) |
| 8  | POST   | `/personagens` | `{"nome":"Merlin","classe":"mago","nivel":5,"jogadorId":1}` | **201** | Cria o personagem `id: 2` com os atributos do mago (hp 80, mp 100, ataque 20, defesa 5) |
| 9  | POST   | `/personagens` | `{"nome":"Robin","classe":"arqueiro","jogadorId":1}` | **400** | `{"erro":"Classe inválida. Use: guerreiro, mago"}` |
| 10 | POST   | `/personagens` | `{"nome":"Fantasma","classe":"mago","jogadorId":99}` | **422** | `{"erro":"Jogador informado não existe"}`: o pai precisa existir |
| 11 | POST   | `/personagens` | `{"nome":"arthos","classe":"mago","jogadorId":1}` | **409** | `{"erro":"Este jogador já tem um personagem com esse nome"}` |
| 12 | POST   | `/personagens` | `{"nome":"Velho","classe":"mago","nivel":150,"jogadorId":1}` | **400** | `{"erro":"Nível deve ser um inteiro entre 1 e 100"}` |
| 13 | GET    | `/personagens?jogadorId=1` | — | **200** | Filtro 1:N: os 2 personagens do jogador 1 |
| 14 | GET    | `/personagens/99` | — | **404** | `{"erro":"Personagem não encontrado"}` |
| 15 | PUT    | `/personagens/1` | `{"nome":"Arthos","classe":"guerreiro","nivel":10,"jogadorId":1}` | **200** | Atualiza o nível para 10 |
| 16 | DELETE | `/jogadores/1` | — | **409** | `{"erro":"Jogador possui personagens; remova-os antes"}` |
| 17 | DELETE | `/personagens/2` | — | **204** | Remove o personagem (sem corpo) |
| 18 | DELETE | `/personagens/1` | — | **204** | Remove o personagem (sem corpo) |
| 19 | DELETE | `/jogadores/1` | — | **204** | Agora o jogador pode ser removido |
| 20 | GET    | `/jogadores/1` | — | **404** | Confirma a remoção |
