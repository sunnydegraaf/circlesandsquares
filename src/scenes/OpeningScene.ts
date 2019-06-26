import { CST } from "../CST";
import { pushBlock } from "../objects/pushBlock";
import { enemy } from "../objects/enemy";
import { bait } from "../objects/bait";
import { characterUlt } from "../objects/characterUlt";
import { characterPush } from "../objects/characterPush";
import { characterBait } from "../objects/characterBait";

export class OpeningScene extends Phaser.Scene {
  private player: characterUlt;
  private playerPush: characterPush;
  private blockGroup: Phaser.Physics.Arcade.Group;
  private enemy: enemy;
  private baitGroup: Phaser.GameObjects.Group;
  private baitCounter: number;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private keySpace: Phaser.Input.Keyboard.Key;
  private Keyboard: any;
  private i: number;
  private text: [string, string, string, string];
  private bait: bait;
  private canpickup: boolean;
  private style: any;
  private counter: number;
  private testPlayer: characterBait;
  keyObj: Phaser.Input.Keyboard.Key;
  private collideExit: boolean;
  private vulnerable: boolean
  canPush: boolean;
  

  constructor() {
    super({
      key: CST.SCENES.OPENING
    });

    this.style = {
      fontFamily: "Arial",
      fontSize: 12,
      color: "#000"
    };

    this.text = [
      "Leg met B aas neer",
      "De enemy is nu verzwakt, raak hem met het blok",
      "Blokken stoppen als ze een enemy raken",
      "Loop naar de uitgang",
    ];

    this.i = 0;
    this.counter = 0;

    this.collideExit = false;

    document.addEventListener("joystick1button1", () => this.placeBait());
    this.baitCounter = 1;

    localStorage.setItem('prevScene', 'opening')
    this.vulnerable = false
    this.canPush = true

  }

  create() {

    //textbox
    this.add
      .rectangle(320, 428, 300, 30, 0xf3f00d)
      .setDepth(5)
      .setOrigin(0.5);
    this.add
      .text(320, 428, "Klik op F om een blok te verschuiven", {
        fontFamily: "Arial",
        fontSize: 12,
        color: "#000"
      })
      .setOrigin(0.5)
      .setDepth(5);

    //map
    let openingMap = this.add.tilemap("openingScene");
    let terrain = openingMap.addTilesetImage("tilesetDungeon", "Dungeon");

    //layers
    let ground = openingMap
      .createStaticLayer("ground", [terrain], 0, 0)
      .setDepth(0);
    let wall = openingMap
      .createStaticLayer("wall", [terrain], 0, 0)
      .setDepth(1);
    let top = openingMap.createStaticLayer("top", [terrain], 0, 0).setDepth(2);
    let exit = openingMap
      .createStaticLayer("exit", [terrain], 0, 0)
      .setDepth(3);

    // pushable blocks
    let pushableBlocks = [];
    pushableBlocks = openingMap.createFromObjects("pushBlocks", 52, {
      key: "pushBlocks"
    });

    this.blockGroup = this.physics.add.group({ runChildUpdate: true });

    for (let i = 0; i < pushableBlocks.length; i++) {
      this.blockGroup.add(
        new pushBlock(this, pushableBlocks[i].x, pushableBlocks[i].y)
      );
    }

    //bait
    this.baitGroup = this.add.group({ runChildUpdate: true });

    // players
    this.player = new characterUlt(this, 550, 130);
    this.playerPush = new characterPush(this, 100, 200)


    // enemies
    this.enemy = new enemy(this, 496, 200);

    //map collisions
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, wall);
    this.physics.add.collider(this.player, top);
    this.physics.add.collider(this.player, exit, this.toPlayScene, null, this);

    this.physics.add.collider(this.playerPush, ground);
    this.physics.add.collider(this.playerPush, wall);
    this.physics.add.collider(this.playerPush, top);
    this.physics.add.collider(this.playerPush, exit, this.PlayerPushExit, null, this);

    this.physics.add.collider(this.player, this.blockGroup, this.getSuffocated, null, this);
    this.physics.add.overlap(this.player, this.enemy, this.gameOver, null, this);

    this.physics.add.collider(this.playerPush, this.blockGroup, this.bounceWall, null, this);
    this.physics.add.overlap(this.playerPush, this.enemy, this.gameOver, null, this);

    this.physics.add.collider(this.enemy, ground);
    this.physics.add.collider(this.enemy, wall);
    this.physics.add.collider(this.enemy, top, this.collidewall, null, this);

    this.physics.add.collider(this.enemy, this.blockGroup, this.enemyDie, null, this);
    this.physics.add.collider(this.blockGroup, top);
    this.physics.add.collider(this.blockGroup, wall);


    this.physics.add.overlap(this.player, this.baitGroup, this.pickupBait, null, this);

    //tile property collisions
    ground.setCollisionByProperty({ collides: true });
    wall.setCollisionByProperty({ collides: true });
    top.setCollisionByProperty({ collides: true });
    exit.setCollisionByProperty({ collides: true });

    this.keyObj = this.input.keyboard.addKey('B', true, true);  // Get key object
    this.Keyboard = this.input.keyboard.addKeys("F");

  }

  PlayerPushExit() {
    this.collideExit = true;
  }

  toPlayScene() {
    // this.camera.fade(0x0 00000, 1000); 
    if (this.collideExit === true)
      this.scene.start(CST.SCENES.PLAY);
  }

  placeBait() {
    setTimeout(() => {
      this.canpickup = true;
    }, 1000);
    if (this.baitCounter !== 0) {
      this.bait = new bait(this, this.player.x, this.player.y);
      this.baitCounter--;
    }
    this.physics.add.overlap(this.player, this.bait, this.pickupBait, null, this);
    this.physics.add.overlap(this.enemy, this.bait, this.eatBait, null, this);
  }

  pickupBait() {
    if (
      this.input.keyboard.checkDown(this.keyObj, 0) &&
      this.canpickup == true
    ) {
      this.bait.destroy(true);
      this.baitCounter++;
      this.canpickup = false;
    }
  }

  eatBait() {
    this.enemy.setVelocity(0);
    this.bait.destroy();
    this.blockText();
    this.vulnerable = true
    setTimeout(() => {
      this.enemy.collideWall();
      this.canpickup = false;
      this.baitCounter++;
      this.vulnerable = false
    }, 3000);
  }

  bounceWall(p: characterPush, b: pushBlock): void {
    if (this.canPush == true) {
      if (b.body.touching.left && this.Keyboard.F.isDown) {
        b.setVelocityX(175);
        this.baitText();
        if (this.counter === 3) {
          this.exitText();
        }
      } else if (b.body.touching.right && this.Keyboard.F.isDown) {
        b.setVelocityX(-175);
      } else if (b.body.touching.up && this.Keyboard.F.isDown) {
        b.setVelocityY(175);
      } else if (b.body.touching.down && this.Keyboard.F.isDown) {
        b.setVelocityY(-175);
      }
    }

  }

  collidewall(e: enemy) {
    this.enemy.upDown();
  }

  getSuffocated(p: characterUlt, b: pushBlock) {
    if (b.body.velocity.x !== 0 || b.body.velocity.y !== 0) {
      p.setVelocity(500)
      this.gameOver(p)
    }
  }

  gameOver(b: characterPush | characterUlt) {
    //play dead animation
    if (b instanceof characterPush) {
      this.playerPush.die()
    }
    if (b instanceof characterUlt) {
      this.player.die()
    }

    setTimeout(() => {
      this.scene.start("gameover");
    }, 1250);
  }

  enemyDie(e: enemy, b: pushBlock) {
    if (this.vulnerable == true) {

      if (b.body.velocity.x !== 0 || b.body.velocity.y !== 0) {
        e.destroy();
        var particles = this.add.particles("blood");

        if (this.counter === 2) {
          this.enemyText();
        }

        this.emitter = particles.createEmitter({
          lifespan: 300,
          speed: 75,
          scale: { start: 0.1, end: 0.05 },
          x: e.x,
          y: e.y + 20
        });

        setTimeout(() => {
          this.emitter.stop();
        }, 300);

        // slow block down
        setTimeout(() => {
          b.setVelocity(0);
        }, 150);
      }

    } else {
      if (b.body.touching.right) {
        b.setPosition(b.x - 1, b.y)
      } else if (b.body.touching.left) {
        b.setPosition(b.x + 1, b.y)
      } else if (b.body.touching.up) {
        b.setPosition(b.x, b.y + 1)
      } else if (b.body.touching.down) {
        b.setPosition(b.x, b.y - 1)
      }

      b.setVelocity(0)
      e.setVelocity(0)
      setTimeout(() => {
        this.collidewall(e)
      }, 500);
    }
    this.canPush = false
    setTimeout(() => {
      this.canPush = true
    }, 1000);
  }

  //loop through array
  displayText(i) {
    this.add
      .text(320, 428, this.text[this.i], this.style)
      .setOrigin(0.5)
      .setDepth(5);
  }

  makeRectangle() {
    this.add
      .rectangle(320, 428, 300, 30, 0xf3f00d)
      .setDepth(5)
      .setOrigin(0.5);
  }

  //text display when player collides with block
  blockText() {
    if (this.counter == 1) {
      this.makeRectangle();
      this.displayText((this.i = 1));
      this.counter++;
    }
  }

  //text display when block collides with enemy
  enemyText() {
    if (this.counter == 2) {
      this.makeRectangle();
      this.displayText((this.i = 2));
      this.counter++;
    }
  }

  //text display when bait collides with enemy
  baitText() {
    if (this.counter == 0) {
      this.makeRectangle();
      this.displayText((this.i = 0));
      this.counter++;
    }
  }

  //text display when players need to go to the exit
  exitText() {
    if (this.counter == 3) {
      this.makeRectangle();
      this.displayText((this.i = 3));
      this.counter++;
    }
  }

  update() {
    if (this.input.keyboard.checkDown(this.keyObj, 500)) {
      this.placeBait();
    }


    this.enemy.update()
    this.player.update()
    this.playerPush.update()
  }
}
