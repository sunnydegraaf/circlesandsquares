import { CST } from "../CST";
import { pushBlock } from "../objects/pushBlock"
import { enemy } from "../objects/enemy";
import { bait } from "../objects/bait";
import { characterUlt } from "../objects/characterUlt";
import { characterPush } from "../objects/characterPush";

export class TestScene extends Phaser.Scene {
    private player: characterUlt;
    private playerPush: characterPush;
    private blockGroup: Phaser.Physics.Arcade.Group
    private enemy: enemy
    private baitGroup: Phaser.GameObjects.Group
    private baitCounter: number
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private keyObj: Phaser.Input.Keyboard.Key
    private keySpace: Phaser.Input.Keyboard.Key
    private Keyboard: any
    private bait: bait
    private canpickup: boolean;

    constructor() {
        super({
            key: CST.SCENES.TEST
        });

        document.addEventListener("joystick1button1", () => this.placeBait())
        this.baitCounter = 1;
        this.canpickup = false
    }

    create() {
      
        //map
        let openingMap = this.add.tilemap("play1");
        let terrain = openingMap.addTilesetImage("tilesetDungeon", "Dungeon");

        //layers
        let ground = openingMap.createStaticLayer("ground", [terrain], 0, 0).setDepth(0);
        let wall = openingMap.createStaticLayer("wall", [terrain], 0, 0).setDepth(1);
        let top = openingMap.createStaticLayer("top", [terrain], 0, 0).setDepth(2);

        // pushable blocks
        let pushableBlocks = [];
        pushableBlocks = openingMap.createFromObjects("pushBlocks", 65, { key: "pushBlocks" })

        this.blockGroup = this.physics.add.group({ runChildUpdate: true })

        for (let i = 0; i < pushableBlocks.length; i++) {
            this.blockGroup.add(new pushBlock(this, pushableBlocks[i].x, pushableBlocks[i].y))
        }

        //bait
        this.baitGroup = this.add.group({ runChildUpdate: true })

        // players
        this.player = new characterUlt(this, 150, 130);
        this.playerPush = new characterPush(this, 100, 200)

        // enemies
        this.enemy = new enemy(this, 496, 200)

        //map collisions
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.player, wall);
        this.physics.add.collider(this.player, top);

        this.physics.add.collider(this.playerPush, ground);
        this.physics.add.collider(this.playerPush, wall);
        this.physics.add.collider(this.playerPush, top);

        this.physics.add.collider(this.player, this.blockGroup)
        this.physics.add.overlap(this.player, this.enemy, this.gameOver, null, this)

        this.physics.add.collider(this.playerPush, this.blockGroup, this.bounceWall, null, this)
        this.physics.add.overlap(this.playerPush, this.enemy, this.gameOver, null, this)

        this.physics.add.collider(this.enemy, ground);
        this.physics.add.collider(this.enemy, wall);
        this.physics.add.collider(this.enemy, top, this.collidewall, null, this);

        this.physics.add.collider(this.enemy, this.blockGroup, this.enemyDie, null, this)
        // this.physics.add.collider(this.enemy, this.blockGroup, this.loopText, null, this)

        this.physics.add.collider(this.blockGroup, top)

        this.physics.add.overlap(this.player, this.baitGroup, this.pickupBait, null, this)

        //tile property collisions
        ground.setCollisionByProperty({ collides: true });
        wall.setCollisionByProperty({ collides: true });
        top.setCollisionByProperty({ collides: true });

        this.keyObj = this.input.keyboard.addKey('B');  // Get key object
        this.Keyboard = this.input.keyboard.addKeys("F");
        this.keySpace = this.input.keyboard.addKey('Space');

    }

    placeBait() {
        setTimeout(() => {
            this.canpickup = true
        }, 1000);
        if (this.baitCounter !== 0) {
            this.bait = new bait(this, this.player.x, this.player.y)
            this.baitCounter--
        }
        this.physics.add.overlap(this.player, this.bait, this.pickupBait, null, this)
        this.physics.add.overlap(this.enemy, this.bait, this.eatBait, null, this)
    }

    pickupBait() {
        if (this.input.keyboard.checkDown(this.keyObj, 0) && this.canpickup == true) {
            this.bait.destroy(true)
            this.baitCounter++
            this.canpickup = false
        }
    }

    eatBait() {
        this.enemy.setVelocity(0)
        this.bait.destroy()

        setTimeout(() => {
            this.enemy.collideWall()
            this.canpickup = false
            this.baitCounter++
        }, 3000);
    }

    bounceWall(p: characterPush, b: pushBlock): void {
        //move block when pushed
        if (b.body.touching.left && this.Keyboard.F.isDown) {
            b.setVelocityX(175)
        } else if (b.body.touching.right && this.Keyboard.F.isDown) {
            b.setVelocityX(-175)
        } else if (b.body.touching.up && this.Keyboard.F.isDown) {
            b.setVelocityY(175)
        } else if (b.body.touching.down && this.Keyboard.F.isDown) {
            b.setVelocityY(-175)
        }
    }

    collidewall(e: enemy) {
        this.enemy.upDown()
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
        if (b.body.velocity.x !== 0 || b.body.velocity.y !== 0) {
            e.destroy()

            var particles = this.add.particles('blood');

            this.emitter = particles.createEmitter({
                lifespan: 300,
                speed: 75,
                scale: { start: 0.1, end: 0.05 },
                x: e.x,
                y: e.y + 20
            });

            setTimeout(() => {
                this.emitter.stop()
            }, 300);

            // slow block down
            setTimeout(() => {
                b.setVelocity(0);
            }, 150);
        } else {
            this.collidewall(e)
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

