import { CST } from "../CST";
import { characterBait } from "../objects/characterBait"
import { pushBlock } from "../objects/pushBlock"
import { enemy } from "../objects/enemy";
import { bait } from "../objects/bait";
import { Arcade } from "../utils/arcade";


export class OpeningScene extends Phaser.Scene {
    private player!: characterBait;
    private blockGroup! : Phaser.Physics.Arcade.Group
    private enemy!: enemy
    private baitGroup!: Phaser.GameObjects.Group
    private baitCounter: number
    private keyObj!: Phaser.Input.Keyboard.Key
    private keySpace!: Phaser.Input.Keyboard.Key
    private Keyboard: any
    private i!: number
    private text!: [string, string, string, string];

    constructor() {
        super({
            key: CST.SCENES.OPENING
        });

        this.text = ['We gaan kijken', 'Of we', 'Door de tekst', 'Kunnen loopen']


        this.i = 0

        document.addEventListener("joystick1button1", () => this.placeBait ())
        this.baitCounter = 3;
    }

    create() {

        //map
        let openingMap = this.add.tilemap("openingScene");
        let terrain = openingMap.addTilesetImage("tilesetDungeon", "Dungeon");

        //layers
        let ground = openingMap.createStaticLayer("ground", [terrain], 0, 0).setDepth(0);
        let wall = openingMap.createStaticLayer("wall", [terrain], 0, 0).setDepth(1);
        let top = openingMap.createStaticLayer("top", [terrain], 0, 0).setDepth(2);
        
         // pushable blocks
         let pushableBlocks = [];
         pushableBlocks = openingMap.createFromObjects("pushBlocks", 52, {key: "pushBlocks" })
         
         this.blockGroup = this.physics.add.group({ runChildUpdate: true})
 
         for (let i = 0; i < pushableBlocks.length; i++ ) {
             this.blockGroup.add(new pushBlock(this, pushableBlocks[i].x, pushableBlocks[i].y ))
         }

         

        //bait
        this.baitGroup = this.add.group({ runChildUpdate: true })

        // players
        this.player = new characterBait(this)

        // enemies
        this.enemy = new enemy(this, 200, 200)

        //map collisions
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.player, wall);
        this.physics.add.collider(this.player, top);

        this.physics.add.collider(this.player, this.blockGroup, this.bounceWall, null, this)
        this.physics.add.collider(this.player, this.enemy, this.gameOver, null, this)

        this.physics.add.collider(this.enemy, ground);
        this.physics.add.collider(this.enemy, wall);
        this.physics.add.collider(this.enemy, top, this.collidewall, null, this);

        this.physics.add.collider(this.enemy, this.blockGroup, this.enemyDie, null, this)

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
        if (this.baitCounter !== 0) {
            this.baitGroup.add(new bait(this, this.player.x, this.player.y), true)
            this.baitCounter--
        }
    }

    pickupBait(b: bait) {
        console.log("moi")
    }

    bounceWall(p: characterBait, b: pushBlock): void {
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

    collidewall() {
        // @ts-ignore
        this.enemy.collideWall()
    }

    gameOver() {
        this.scene.start("gameover");
    }

    enemyDie(b: pushBlock) {
        if (b.body.velocity.x !== 0 || b.body.velocity.y !== 0) {
            this.enemy.destroy()

            // slow block down
            setTimeout(() => {
                b.setVelocity(0);
            }, 150);
        } else {
            this.collidewall()
        }
    }
    
    loopText() {
        this.add.rectangle(320, 450, 150, 30, 0xffffff,).setDepth(5).setOrigin(0.5)
        this.add.text(320, 450, this.text[this.i], { 
            fontFamily: 'Arial', 
            fontSize: 12, 
            color: '#ff3434', 
        }).setOrigin(0.5).setDepth(5)
        console.log(this.i)
        this.i++
       
        if(this.i > this.text.length) {
            console.log('delete')
            this.add.rectangle(320, 450, 150, 30, 0x181424,).setDepth(5).setOrigin(0.5)
        }
    }

    update() {
        if (this.input.keyboard.checkDown(this.keyObj, 500)) {
            this.placeBait()
        }

        if (this.input.keyboard.checkDown(this.keySpace, 500)) {
            this.loopText()
        }
        
        this.player.update()
        
        }
}

