import { PlayScene } from "../scenes/PlayScene";

export class enemy extends Phaser.Physics.Arcade.Sprite {
  private playScene: PlayScene;
  private walking_distance: number;
  private new_position: number | undefined;
  private direction: number;
  private previous_position: number;

  constructor(scene: PlayScene, x:number, y:number) {
    super(scene, x, y, "monster");

    this.playScene = scene;
    this.scene.add.existing(this);
    this.setDepth(5);
    this.addPhysics();
    this.addAnimations();
    this.play("walkenemy", true);
    this.setVelocityY(-100);
    this.body.setSize(32,20)
    this.body.setOffset(0,2.5)
    this.flipX = true;
    this.walking_distance = Phaser.Math.Between(98, 255);
    this.direction = this.angle;
    this.previous_position = this.x;
  }

  private addPhysics() {
    this.scene.physics.add.existing(this);
    this.setSize(this.displayWidth, this.displayHeight);
    this.setCollideWorldBounds(true);
  }

  public addAnimations(): void {
    this.scene.anims.create({
      key: "walkenemy",
      frames: this.scene.anims.generateFrameNumbers("monster", {
        start: 0,
        end: 3
      }),
      repeat: -1,
      frameRate: 10
    });
  }

  public collideWall() {
    // AI movement
    let direction = Phaser.Math.Between(1, 4);
    if (direction == 1) {
      this.setVelocityY(-100);
    } else if (direction == 2) {
      this.setVelocityY(100);
    } else if (direction == 3) {
      this.setVelocityX(100);
      this.flipX = false;
    } else {
      this.setVelocityX(-100);
      this.flipX = true;
    }
  }

  public update() {
    //test for better ai
    // this.new_position =  this.x;
    // if (Math.abs(this.new_position - this.previous_position) >= this.walking_distance) {
    //     this.switch_direction();
    // }
  }

  public switch_direction() {
    this.previous_position = this.x;
    this.body.velocity.x *= -1;
    this.flipX = true;
  }
}
