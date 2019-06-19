import { Arcade } from "../utils/arcade";
import { MonsterHunter } from "../main";

export class characterPush extends Phaser.Physics.Arcade.Sprite {
    private keyboard: any;
    private arcade: Arcade;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private died: boolean;

    constructor(scene: Phaser.Scene) {
        super(scene, 200, 415, "characterPush", 0);

        this.died = false
        let g = this.scene.game as MonsterHunter;
        this.arcade = g.arcade;

        this.scene.add.existing(this);
        this.setDepth(5);
        this.addPhysics();
        this.setImmovable(true)
        this.addAnimations();
        this.addParticles();
        this.getCenter()
        this.body.setSize(17, 23)
        this.body.setOffset(7, 5)
        this.play("idlebig")
        this.setScale(1.2)
        this.cursors = this.scene.input.keyboard.createCursorKeys()
        this.keyboard = this.scene.input.keyboard.addKeys("F");
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
            key: "idlebig",
            frames: this.scene.anims.generateFrameNumbers("characterPush", {
                start: 0,
                end: 4
            }),
            frameRate: 10
        });

        this.scene.anims.create({
            key: "walkbig",
            frames: this.scene.anims.generateFrameNumbers("characterPush", {
                start: 9,
                end: 16
            }),
            frameRate: 10
        });

        this.scene.anims.create({
            key: "diebig",
            frames: this.scene.anims.generateFrameNumbers("characterPush", {
                start: 35,
                end: 40
            }),
            frameRate: 10,
        });
    }

    private joystickInput(): void {
        for (let joystick of this.arcade.Joysticks) {
            joystick.update();
        }

        if (this.arcade.Joysticks[1]) {
            this.play("walkbig", true);
            this.setVelocityX(this.arcade.Joysticks[1].X * 100);
            this.setVelocityY(this.arcade.Joysticks[1].Y * 100);

            if (this.arcade.Joysticks[1].X == 1) {
                this.flipX = false;
            }

            if (this.arcade.Joysticks[1].X == -1) {
                this.flipX = true;
            }

            if (this.arcade.Joysticks[1].X == 0 && this.arcade.Joysticks[1].Y == 0) {
                this.play("walkbig", false);
            }
        }
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

    die() {
        this.died = true
        this.play("diebig", true);
        setTimeout(() => {
            this.setVisible(false)
        }, 500);
        this.setMaxVelocity(0)
    }

    private keyboardInput(): void {
        // player movement
        if (this.cursors.up.isDown) {
            this.setVelocityY(-100);
            this.play("walkbig", true);
            this.flipX = false;
        }

        if (this.cursors.down.isDown) {
            this.setVelocityY(100);
            this.play("walkbig", true);
        }

        if (this.cursors.left.isDown) {
            this.setVelocityX(-100);
            this.play("walkbig", true);
            this.flipX = true;
        }

        if (this.cursors.right.isDown) {
            this.setVelocityX(100);
            this.play("walkbig", true);
            this.flipX = false;
        }

        if (this.cursors.left.isUp && this.cursors.right.isUp) {
            this.setVelocityX(0);
        }

        if (this.cursors.up.isUp && this.cursors.down.isUp) {
            this.setVelocityY(0);
        }

        if (this.cursors.left.isUp && this.cursors.right.isUp && this.cursors.up.isUp && this.cursors.down.isUp && this.died == false) {
            this.play("idlebig", true)
        }
    }
}
