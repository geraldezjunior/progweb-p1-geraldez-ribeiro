# Modelagem: RPG de Turnos

## Entidades

### Jogador
| Campo | Tipo | Regras |
|-------|------|--------|
| id | number | gerado pela API |
| nome | string | obrigatório |
| nick | string | obrigatório; de 3 a 20 caracteres (letras, números, `_`); **único** (sem diferenciar maiúsculas/minúsculas) |

### Personagem
| Campo | Tipo | Regras |
|-------|------|--------|
| id | number | gerado pela API |
| nome | string | obrigatório; **único entre os personagens do mesmo jogador** |
| classe | string | obrigatório; `guerreiro` ou `mago` (as subclasses de `Personagem` da S2) |
| nivel | number | inteiro de 1 a 100; padrão 1 |
| hp, mp, ataque, defesa | number | definidos pela classe (não vêm do cliente) |
| jogadorId | number | obrigatório; precisa ser um jogador existente |

Atributos base por classe:

| Classe | hp | mp | ataque | defesa |
|--------|----|----|--------|--------|
| guerreiro | 120 | 30 | 15 | 10 |
| mago | 80 | 100 | 20 | 5 |

## Relação

**Jogador 1 : N Personagem**: um jogador tem vários personagens, e cada personagem pertence a um único jogador (`jogadorId`).

```
Jogador (1) ───────< (N) Personagem
  id                       jogadorId
```

- Não é possível criar personagem para um jogador inexistente (**422**).
- Não é possível remover um jogador que ainda tem personagens (**409**).
- `GET /personagens?jogadorId=1` lista os personagens de um jogador.

## Endpoints (backend/)

| Recurso | Rotas |
|---------|-------|
| `/jogadores` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| `/personagens` | `GET /` (com filtro opcional `?jogadorId=`), `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |

## Próximos passos
- Entidade **Batalha** (N:N entre personagens, com turnos e vencedor), a partir da classe `Batalha` da S2.
