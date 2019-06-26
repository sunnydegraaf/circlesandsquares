import { CST } from "../CST";
import { characterBait } from "../objects/characterBait"
import { pushBlock } from "../objects/pushBlock"
import { enemy } from "../objects/enemy";
import { bait } from "../objects/bait";
import { characterUlt } from "../objects/characterUlt";
import { characterPush } from "../objects/characterPush";
import { Timer } from "../objects/Countdown"

export class PlayScene extends Phaser.Scene {
    private player: characterUlt;
    private playerPush: characterPush;

    private blockGroup: Phaser.Physics.Arcade.Group
    private bait: bait
    private baitCounter: number
    private enemyCounter: number
    private keyObj: Phaser.Input.Keyboard.Key
    private Keyboard: any
    private canpickup: boolean;
    private enemyGroup: Phaser.Physics.Arcade.Group;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    private top: Phaser.Tilemaps.DynamicTilemapLayer
    private wall: Phaser.Tilemaps.DynamicTilemapLayer
    private ground: Phaser.Tilemaps.DynamicTilemapLayer
    private mappy: Phaser.Tilemaps.Tilemap
    private timer: Timer;
    private timertext: Phaser.GameObjects.Text;
    private vulnerable: boolean
    canPush: boolean;

    constructor() {
        super({
            key: CST.SCENES.PLAY
        });
        this.baitCounter = 1;
        this.canpickup = false

        document.addEventListener("joystick1button1", () => {
            this.placeBait()
            this.pickupBaitJoy()
        })

        this.vulnerable = false
        localStorage.setItem('prevScene', 'opening')
        this.canPush = true
    }

    create(): void {
        //map
        this.mappy = this.add.tilemap("play1");
        let terrain = this.mappy.addTilesetImage("tilesetDungeon", "Dungeon");

        //layers
        this.ground = this.mappy.createDynamicLayer("ground", [terrain], 0, 0).setDepth(0);
        this.wall = this.mappy.createDynamicLayer("wall", [terrain], 0, 0).setDepth(2);
        this.top = this.mappy.createDynamicLayer("top", [terrain], 0, 0).setDepth(1);

        //timer
        this.timer = new Timer()
        this.timer.time = 180
        this.timertext = this.add.text(15, 455, this.timer.time.toString()).setDepth(10);;


        // pushable blocks
        let pushableBlocks = [];
        pushableBlocks = this.mappy.createFromObjects("pushBlocks", 65, { key: "pushableBlocks" })

        this.blockGroup = this.physics.add.group({ runChildUpdate: true })

        for (let i = 0; i < pushableBlocks.length; i++) {
            this.blockGroup.add(new pushBlock(this, pushableBlocks[i].x, pushableBlocks[i].y))
        }

        //enemies
        let enemies = [];
        enemies = this.mappy.createFromObjects("enemies", 66, { key: "enemies" })

        this.enemyGroup = this.physics.add.group({ runChildUpdate: true })

        for (let i = 0; i < enemies.length; i++) {
            this.enemyGroup.add(new enemy(this, enemies[i].x, enemies[i].y))
        }
        this.enemyGroup.setVelocityX(100)

        this.enemyCounter = enemies.length
        console.log(this.enemyCounter)

        // players
        this.player = new characterUlt(this, 50, 75);
        this.playerPush = new characterPush(this, 50, 100)

        //map collisions
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.wall);
        this.physics.add.collider(this.player, this.top);

        this.physics.add.collider(this.playerPush, this.ground);
        this.physics.add.collider(this.playerPush, this.wall);
        this.physics.add.collider(this.playerPush, this.top);


        this.physics.add.collider(this.player, this.blockGroup, this.getSuffocated, null, this);
        this.physics.add.overlap(this.player, this.enemyGroup, this.gameOver, null, this);

        this.physics.add.collider(this.playerPush, this.blockGroup, this.bounceWall, null, this)
        this.physics.add.overlap(this.playerPush, this.enemyGroup, this.gameOver, null, this)

        this.physics.add.collider(this.enemyGroup, this.ground);
        this.physics.add.collider(this.enemyGroup, this.wall);
        this.physics.add.collider(this.enemyGroup, this.top, this.collidewall, null, this);

        this.physics.add.collider(this.enemyGroup, this.blockGroup, this.enemyDie, null, this)
        this.physics.add.collider(this.blockGroup, this.blockGroup, this.blockDestroy, null, this)

        this.physics.add.collider(this.blockGroup, this.top)

        //tile property collisions
        this.ground.setCollisionByProperty({ collides: true });
        this.wall.setCollisionByProperty({ collides: true });
        this.top.setCollisionByProperty({ collides: true });

        this.keyObj = this.input.keyboard.addKey('B');  // Get key object
        this.Keyboard = this.input.keyboard.addKeys("F");

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
        this.physics.add.overlap(this.enemyGroup, this.bait, this.eatBait, null, this)
    }

    pickupBait() {
        if (this.input.keyboard.checkDown(this.keyObj, 0) && this.canpickup == true) {
            this.bait.destroy(true)
            this.baitCounter++
            this.canpickup = false
        }
    }

    pickupBaitJoy() {
        if (this.physics.collide(this.player, this.bait) && this.canpickup == true) {
            this.bait.destroy(true)
            this.baitCounter++
            this.canpickup = false
        }
        console.log("kek")
    }

    eatBait(b: bait, e: enemy) {
        this.vulnerable = true
        e.setVelocity(0)
        this.bait.destroy()

        setTimeout(() => {
            this.vulnerable = false
            e.collideWall()
            this.canpickup = false
            this.baitCounter++
        }, 3000);
    }

    bounceWall(p: characterPush | characterUlt, b: pushBlock): void {

        
        //move block when pushed
        if (this.canPush = true) {
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

    }

    collidewall(e: enemy) {

        setTimeout(() => {
            e.collideWall()
        }, 500);
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
            if (b.body.velocity.x !== 0 || b.body.velocity.y !== 0) {
                if (b.body.touching.right) {
                    b.setPosition(b.x - 1, b.y)
                } else if (b.body.touching.left) {
                    b.setPosition(b.x + 1, b.y)
                } else if (b.body.touching.up) {
                    b.setPosition(b.x, b.y + 1)
                } else if (b.body.touching.down) {
                    b.setPosition(b.x, b.y - 1)
                }
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

    blockDestroy(s: pushBlock, b: pushBlock) {
        if (s.body.velocity.x !== 0 || b.body.velocity.y !== 0) {
            s.destroy()

            var particles = this.add.particles('smokeblock');

            this.emitter = particles.createEmitter({
                lifespan: 300,
                speed: 75,
                scale: { start: 0.1, end: 0.05 },
                x: s.x,
                y: s.y + 20
            });

            //slow block down
            setTimeout(() => {
                b.setVelocity(0);
            }, 150);

            setTimeout(() => {
                this.emitter.stop()
            }, 300);
        }
    }

    update() {
        if (this.input.keyboard.checkDown(this.keyObj, 500)) {
            this.placeBait();
        }
        this.player.update()
        this.playerPush.update()
        setInterval(() => {

            this.timertext.setText(this.timer.time.toString())
        }, 1000);

        if (this.timer.time == 0) {
            this.gameOver(this.player)
        }

        

    }
}
