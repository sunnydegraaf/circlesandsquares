export class enemy extends Phaser.Physics.Arcade.Sprite {
  private walking_distance: number;
  private new_position: number | undefined;
  private direction: number;
  private previous_position: number;

  constructor(scene: Phaser.Scene, x:number, y:number) {
    super(scene, x, y, "monster");

    this.scene.add.existing(this);
    this.setDepth(5);
    this.addPhysics();
    this.addAnimations();
    this.play("walkenemy", true);
    this.setVelocityY(-100);
    this.body.setSize(25,20)
    this.setScale(1.2)
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
        start: 9,
        end: 13
      }),
      repeat: -1,
      frameRate: 10
    });

    this.scene.anims.create({
      key: "enemyidle",
      frames: this.scene.anims.generateFrameNumbers("monster", {
        start: 0,
        end: 7
      }),
      frameRate: 10
    });
  }

  public collideWall() {
    // AI movement
    let direction = Phaser.Math.Between(1, 4);
    if (direction == 1) {
      this.play("walkenemy")
      this.setVelocityY(-100);
    } else if (direction == 2) {
      this.play("walkenemy")
      this.setVelocityY(100);
    } else if (direction == 3) {
      this.play("walkenemy")
      this.setVelocityX(100);
      this.flipX = false;
    } else {
      this.play("walkenemy")
      this.setVelocityX(-100);
      this.flipX = true;
    }
  }

public upDown() {
  let direction = Phaser.Math.Between(1, 2);
  if (direction == 1) {
    this.setVelocityY(-100);
  } else if (direction == 2) {
    this.setVelocityY(100);
  }
}

  // public collideWall(up:boolean, right:boolean, down:boolean, left:boolean) {
  //   // AI movement
  //   let direction = Phaser.Math.Between(1, 4);
  //   if (up == true && direction == 1) {
  //     console.log('up');
  //     this.setVelocityY(-100);
  //   } else if (down == true && direction == 2) {
  //     console.log('down');
  //     this.setVelocityY(100);
  //   } else if (right == true && direction == 3) {
  //     console.log('right');
  //     this.setVelocityX(100);
  //     this.flipX = false;
  //   } else {
  //     this.setVelocityX(left == true && -100);
  //     console.log('left');
  //     this.flipX = true;
  //   }
  // }

  public update() {
  }

  public switch_direction() {
    this.previous_position = this.x;
    this.body.velocity.x *= -1;
    this.flipX = true;
  }
}
