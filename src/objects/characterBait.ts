import { PlayScene } from "../scenes/PlayScene";
import { Arcade } from "../utils/arcade";
import { MonsterHunter } from "../main";

export class characterBait extends Phaser.Physics.Arcade.Sprite {
  private playScene: PlayScene;
  private keyboard: any;
  private arcade: Arcade;

  constructor(scene: PlayScene) {
    super(scene, 144, 415, "characterBait");

    let g = this.scene.game as MonsterHunter;
    this.arcade = g.arcade;

    this.playScene = scene;

    this.scene.add.existing(this);
    this.setDepth(5);
    this.addPhysics();
    this.addAnimations();

    this.keyboard = this.scene.input.keyboard.addKeys("W, A, S, D, B, F");
  }

  private addPhysics() {
    this.scene.physics.add.existing(this);
    this.setSize(this.displayWidth, this.displayHeight);
    this.setCollideWorldBounds(true);
  }

  public update(): void {
    this.keyboardInput();
    this.joystickInput();
  }

  public addAnimations(): void {
    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("characterBait", {
        start: 3,
        end: 5
      }),
      frameRate: 10
    });
  }

  private joystickInput(): void {
    for (let joystick of this.arcade.Joysticks) {
      joystick.update();
    }

    if (this.arcade.Joysticks[1]) {
      this.play("walk", true);
      this.setVelocityX(this.arcade.Joysticks[1].X * 100);
      this.setVelocityY(this.arcade.Joysticks[1].Y * 100);

      if (this.arcade.Joysticks[1].X == 1) {
        this.flipX = false;
      }

      if (this.arcade.Joysticks[1].X == -1) {
        this.flipX = true;
      }

      if (this.arcade.Joysticks[1].X == 0 && this.arcade.Joysticks[1].Y == 0) {
        this.play("walk", false);

      }


    }
  }

  private keyboardInput(): void {
    // player movement
    if (this.keyboard.W.isDown) {
      this.setVelocityY(-100);
      this.play("walk", true);
      this.flipX = false;
    }

    if (this.keyboard.S.isDown) {
      this.setVelocityY(100);
      this.play("walk", true);
    }

    if (this.keyboard.A.isDown) {
      this.setVelocityX(-100);
      this.play("walk", true);
      this.flipX = true;
    }

    if (this.keyboard.D.isDown) {
      this.setVelocityX(100);
      this.play("walk", true);
      this.flipX = false;
    }

    if (this.keyboard.A.isUp && this.keyboard.D.isUp) {
      this.setVelocityX(0);
    }

    if (this.keyboard.S.isUp && this.keyboard.W.isUp) {
      this.setVelocityY(0);
    }
  }
}
