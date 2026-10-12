class Guerreiro extends Personagem {
  constructor(nome, hp, mp, ataque, defesa) {
    super(nome, hp, mp, ataque, defesa);
  }

  usarHabilidadeEspecial(alvo) {
    const custoMp = 15;
    if (this.mp < custoMp) {
      console.log(
        `${this.nome} não tem energia suficiente para a Postura Defensiva!`,
      );
      return;
    }

    this.mp -= custoMp;
    const bonusDefesa = 10;
    this.defesa += bonusDefesa;
    console.log(
      `🛡️ ${this.nome} assume Postura Defensiva! Sua defesa aumenta em +${bonusDefesa} (Defesa atual: ${this.defesa})`,
    );

    const danoFisico = this.ataque * 1.2;
    alvo.receberDano(danoFisico);
  }
}
