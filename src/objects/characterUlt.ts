import { Arcade } from "../utils/arcade";
import { MonsterHunter } from "../main";

export class characterUlt extends Phaser.Physics.Arcade.Sprite {
  private keyboard: any;
  private arcade: Arcade;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private died: boolean;


  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "characterUlt", 0);

    let g = this.scene.game as MonsterHunter;
    this.died = false
    this.arcade = g.arcade;

    this.scene.add.existing(this);
    this.setDepth(5);
    this.addPhysics();
    this.addAnimations();
    this.addParticles();
    this.getCenter()
    this.body.setSize(17, 23)
    this.body.setOffset(7, 8)
    this.play("idle")
    this.setScale(1.2)
    this.keyboard = this.scene.input.keyboard.addKeys("W, A, S, D, B, F");
  }

  private addPhysics() {
    this.scene.physics.add.existing(this);
    this.setSize(this.displayWidth, this.displayHeight);
    this.setCollideWorldBounds(true);
  }

  public update(): void {
    if (this.died == false) {
      this.keyboardInput();
      this.joystickInput();
    }


    if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
      this.emitter.start()
      this.emitter.startFollow(this)
    } else {
      this.emitter.stop()
    }
    //fading particles
    this.emitter.forEachAlive(function (particle) {
      particle.alpha = particle.life / 1000, 0, 1;
    }, this);
  }


  public addAnimations(): void {
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("characterUlt", {
        start: 1,
        end: 13
      }),
      frameRate: 10
    });

    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("characterUlt", {
        start: 14,
        end: 20
      }),
      frameRate: 10
    });

    this.scene.anims.create({
      key: "die",
      frames: this.scene.anims.generateFrameNumbers("characterUlt", {
        start: 94,
        end: 99
      }),
      frameRate: 10,
      repeat: 1
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

  die() {
    this.died = true
    this.play("die", true);
    setTimeout(() => {
      this.setVisible(false)
    }, 500);
    this.setMaxVelocity(0)
  }

  private addParticles() {
    var particles = this.scene.add.particles('smoke');

    this.emitter = particles.createEmitter({
      lifespan: 400,
      speed: 30,
      y: 10,
      scale: { start: 0.1, end: 0.05 },
    });
  };

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

    if (this.keyboard.A.isUp && this.keyboard.S.isUp && this.keyboard.W.isUp && this.keyboard.D.isUp && this.died == false) {
      this.play("idle", true)
    }
  }
}
