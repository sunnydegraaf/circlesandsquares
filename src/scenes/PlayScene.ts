import { CST } from "../CST";

export class PlayScene extends Phaser.Scene {
  Keyboard: any;
  player!: Phaser.Physics.Arcade.Sprite;
  numberOfBait: number;
  baitTimer: number;
  bait!: Phaser.Physics.Arcade.Sprite;
  baitsgroup!: Phaser.GameObjects.Group;
  enemy!: Phaser.Physics.Arcade.Sprite;
  skeleton!: Phaser.Physics.Arcade.Sprite;
  block!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super({
      key: CST.SCENES.PLAY
    });

    this.numberOfBait = 3;
    this.baitTimer = 1;
  }

  preload() {
    this.load.image("Dungeon", require("../assets/image/tileset_dungeon.png"));
    this.load.tilemapTiledJSON("mappy", require("../assets/maps/testmap.json"));

    this.load.spritesheet("dude", require("../assets/image/character.png"), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("enemy", require("../assets/image/enemy.png"), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("bait", require("../assets/image/Food.png"), {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet("block", require("../assets/image/block.png"), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("skeleton", require("../assets/image/skeleton.png"), {
      frameWidth: 32,
      frameHeight: 32
    });
  }



  create() {
    //map
    let mappy = this.add.tilemap("mappy");
    let terrain = mappy.addTilesetImage("tileset_dungeon", "Dungeon");
    this.block = this.physics.add.sprite(368, 304, "block").setDepth(5).setImmovable(true);

    //layers
    let ground = mappy.createStaticLayer("ground", [terrain], 0, 0).setDepth(0);
    let wall = mappy.createStaticLayer("wall", [terrain], 0, 0).setDepth(1);
    let top = mappy.createStaticLayer("top", [terrain], 0, 0).setDepth(2);

    // player
    this.player = this.physics.add.sprite(150, 415, "dude").setDepth(5);
    this.enemy = this.physics.add.sprite(150, 432, "enemy").setDepth(5);
    this.skeleton = this.physics.add.sprite(300, 432, "skeleton").setDepth(4);
    this.physics.add.collider(this.player, ground);

    //map collisions
    this.physics.add.collider(this.player, top);
    this.physics.add.collider(this.player, wall);
    this.physics.add.collider(this.player, ground);

    this.physics.add.collider(this.enemy, top);
    this.physics.add.collider(this.enemy, wall);
    this.physics.add.collider(this.enemy, ground);

    this.physics.add.collider(this.block, top, this.blockCollideWall, undefined, this);
    this.physics.add.collider(this.block, wall);
    this.physics.add.collider(this.block, ground);
    
    //player collisions
    this.physics.add.collider(this.player, this.enemy)
    this.physics.add.collider(this.player, this.block, this.playerCollideBlock, undefined, this);

    //tile property
    ground.setCollisionByProperty({ collides: true });
    wall.setCollisionByProperty({ collides: true });
    top.setCollisionByProperty({ collides: true });

    //animations
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("dude", { start: 3, end: 5 }),
      frameRate: 10
    });

    this.anims.create({
      key: "walkEnemy",
      frames: this.anims.generateFrameNumbers("enemy", { start: 3, end: 5 }),
      frameRate: 10
    });

    //keyboard input
    this.Keyboard = this.input.keyboard.addKeys("W, A, S, D, B, P, F");

    // bait group
    this.baitsgroup = this.add.group()

    // enemy movement
    this.enemy.setVelocityX(100);

  }

  collideWall(){
    console.log("boem!")
  }

  playerCollideBlock() {
    if(this.block.body.touching.left && this.Keyboard.F.isDown)  {
      this.block.setVelocityX(120)
    } else if (this.block.body.touching.right && this.Keyboard.F.isDown) {
        this.block.setVelocityX(-120)
    } else if (this.block.body.touching.up && this.Keyboard.F.isDown) {
      this.block.setVelocityY(120)
    } else if (this.block.body.touching.down && this.Keyboard.F.isDown) {
      this.block.setVelocityY(-120)
    }
  }

  blockCollideWall(){
    console.log("blockCollideWall")
  }

  update(time: number, delta: number) {
    // bait pickup
    if (
      this.physics.world.overlap(this.player, this.baitsgroup) &&
      this.Keyboard.B.isDown &&
      this.baitTimer == 1
    ) {
      this.numberOfBait++;
      console.log("works");
    }

    // player movement
    if (this.Keyboard.W.isDown) {
      this.player.setVelocityY(-100);
      this.player.play("walk", true);
      this.player.flipX = false;
    }

    if (this.Keyboard.S.isDown) {
      this.player.setVelocityY(100);
      this.player.play("walk", true);
    }

    if (this.Keyboard.A.isDown) {
      this.player.setVelocityX(-100);
      this.player.play("walk", true);
      this.player.flipX = true;
    }

    if (this.Keyboard.D.isDown) {
      this.player.setVelocityX(100);
      this.player.play("walk", true);
      this.player.flipX = false;
    }

    if (
      this.Keyboard.B.isDown &&
      this.numberOfBait > 0 &&
      this.baitTimer == 1 &&
      !this.physics.world.overlap(this.player, this.baitsgroup)
    ) {
      this.numberOfBait--;
      this.baitTimer = 0;
      this.baitsgroup.add(this.physics.add
        .sprite(this.player.x, this.player.y, "bait")
        .setDepth(5)
        .setScale(1.25)
        .setFrame(21)
        .setImmovable(true))
       
      setTimeout(() => {
        this.baitTimer = 1;
      }, 500);
    }

    if (this.Keyboard.A.isUp && this.Keyboard.D.isUp) {
      this.player.setVelocityX(0);
    }

    if (this.Keyboard.S.isUp && this.Keyboard.W.isUp) {
      this.player.setVelocityY(0);
    }

    if(this.physics.world.collide(this.enemy, this.block)) {
      this.enemy.setVelocityX(-100);
    }

    

    if(this.physics.world.collide(this.enemy, this.block)) {
      this.enemy.setTexture('skeleton');
      this.enemy.setDepth(3).setImmovable(true);
    }

    // this.physics.world.collide(this.player, this.block)
    this.physics.add.overlap(this.player, this.block)

    if(this.physics.world.collide(this.block, this.enemy)){
      this.enemy.destroy()
    }
  }
}
