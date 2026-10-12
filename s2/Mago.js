class Mago extends Personagem {
  constructor(nome, hp, mp, ataque, defesa) {
    super(nome, hp, mp, ataque, defesa);
  }

  usarHabilidadeEspecial(alvo) {
    const custoMp = 30;
    if (this.mp < custoMp) {
      console.log(`${this.nome} não tem mana suficiente para a Bola de Fogo!`);
      return;
    }

    this.mp -= custoMp;
    const danoMagico = this.ataque * 2.5;
    console.log(` ${this.nome} lança uma Bola de Fogo  em ${alvo.nome}!`);
    alvo.receberDano(danoMagico);
  }
}
