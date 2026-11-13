class Personagem {
  constructor(nome, hp, mp, ataque, defesa) {
    if (this.constructor === Personagem) {
      throw new Error(
        'Não é possível instanciar a classe abstrata Personagem diretamente.',
      );
    }
    this.nome = nome;
    this.hp = hp;
    this.maxHp = hp;
    this.mp = mp;
    this.maxMp = mp;
    this.ataque = ataque;
    this.defesa = defesa;
  }

  // Método que será polimórfico nas classes filhas
  usarHabilidadeEspecial() {
    throw new Error(
      'O método usarHabilidadeEspecial() deve ser implementado na subclasse.',
    );
  }

  receberDano(quantidade) {
    const danoReal = Math.max(1, quantidade - this.defesa);
    this.hp = Math.max(0, this.hp - danoReal);
    console.log(
      `${this.nome} recebeu ${danoReal} de dano. HP atual: ${this.hp}/${this.maxHp}`,
    );
  }

  estaVivo() {
    this.estaVivo = () => this.hp > 0;
    return this.hp > 0;
  }
}
