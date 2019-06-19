import { Arcade } from "../utils/arcade";
import { MonsterHunter } from "../main";
import { CST } from "../CST";

export class MenuScene extends Phaser.Scene {
  private arcade!: Arcade;
  private playTween: Phaser.Tweens.Tween;
  private optionsTween: Phaser.Tweens.Tween;

  constructor() {
    super({
      key: CST.SCENES.MENU
    });
  }
  init() { }
  create() {
    let g = this.game as MonsterHunter;
    this.arcade = g.arcade;

    document.addEventListener("joystick1button0", () => this.nextGame());

    let background = this.add
      .image(0, 0, "background")
      .setOrigin(0)
      .setDepth(0);

    let playButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2,
        "play_button"
      )
      .setDepth(2);

    let optionsButton = this.add
      .image(
        this.game.renderer.width / 2,
        this.game.renderer.height / 2 + 100,
        "options_button"
      )
      .setDepth(2);

    playButton.setInteractive();

    playButton.on("pointerover", () => {
      this.playTween = this.tweens.add({
        targets: playButton,
        alpha: 0.8,
        scaleX: 1.2,
        scaleY: 1.2,
        ease: "Cubic.easeInOut",
        duration: 400,
        yoyo: true,
        repeat: -1
      });
    });

    playButton.on("pointerout", () => {
      playButton.setScale(1);
      this.tweens.remove(this.playTween);
    });

    playButton.on("pointerup", () => {
      this.scene.start(CST.SCENES.OPENING);
    });

    optionsButton.setInteractive();

    optionsButton.on("pointerover", () => {
      this.optionsTween = this.tweens.add({
        targets: optionsButton,
        alpha: 0.8,
        scaleX: 1.2,
        scaleY: 1.2,
        ease: "Cubic.easeInOut",
        duration: 400,
        yoyo: true,
        repeat: -1
      });
    });

    optionsButton.on("pointerout", () => {
      optionsButton.setScale(1);
      this.tweens.remove(this.optionsTween);
    });

    optionsButton.on("pointerup", () => {
      //options
    });
  }

  public update(): void {
    for (let joystick of this.arcade.Joysticks) {
      joystick.update();
    }
  }

  private nextGame() {
    this.scene.start(CST.SCENES.PLAY);
  }
}
