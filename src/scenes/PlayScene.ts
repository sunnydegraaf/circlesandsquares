import { CST } from "../CST";


export class PlayScene extends Phaser.Scene {
    Keyboard: any;
    player!: Phaser.Physics.Arcade.Sprite;
    numberOfBait: number;
    baitTimer: number;

    constructor() {

        super({
            key: CST.SCENES.PLAY
        });

        this.numberOfBait = 3
        this.baitTimer = 1
    }


    preload() {



        this.load.image("Dungeon", "./assets/image/tileset_dungeon.png");
        this.load.tilemapTiledJSON("mappy", "./assets/maps/testmap.json");

        this.load.spritesheet('dude',
            './assets/image/character.png',
            { frameWidth: 32, frameHeight: 32 }
        );


        this.load.spritesheet('bait',
            './assets/image/Food.png',
            { frameWidth: 16, frameHeight: 16 }
        );


    }

    create() {

        let mappy = this.add.tilemap("mappy");
        let terrain = mappy.addTilesetImage("tileset_dungeon", "Dungeon");

        //layers

        let ground = mappy.createStaticLayer("ground", [terrain], 0, 0).setDepth(0);
        let wall = mappy.createStaticLayer("wall", [terrain], 0, 0).setDepth(1);
        let top = mappy.createStaticLayer("top", [terrain], 0, 0).setDepth(2);

        // player
        this.player = this.physics.add.sprite(150, 415, 'dude').setDepth(5);

        //map collisions
        this.physics.add.collider(this.player, top);
        this.physics.add.collider(this.player, wall);
        this.physics.add.collider(this.player, ground);

        //tile property
        ground.setCollisionByProperty({ collides: true });
        wall.setCollisionByProperty({ collides: true });
        top.setCollisionByProperty({ collides: true });

        //animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 5 }),
            frameRate: 10,

        });


        //

        //keyboard input
        this.Keyboard = this.input.keyboard.addKeys("W, A, S, D, B")

    }

    update(time: number, delta: number) {



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

        if (this.Keyboard.B.isDown && this.numberOfBait > 0 && this.baitTimer == 1) {
            this.numberOfBait--
            this.baitTimer = 0
            this.add.sprite(this.player.x, this.player.y, "bait").setDepth(5).setScale(1.25).setFrame(21);
            setTimeout(() => {
                this.baitTimer = 1
            }, 500);
        }

        if (this.Keyboard.A.isUp && this.Keyboard.D.isUp) {
            this.player.setVelocityX(0);
        }


        if (this.Keyboard.S.isUp && this.Keyboard.W.isUp) {
            this.player.setVelocityY(0);
        }




    }
}