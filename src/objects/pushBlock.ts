import { PlayScene } from "../scenes/PlayScene"
import { OpeningScene } from "../scenes/OpeningScene";

export class pushBlock extends Phaser.Physics.Arcade.Sprite {

    private playScene: PlayScene
    private OpeningScene: OpeningScene
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "pushBlock")

        this.scene.add.existing(this)
        this.setDepth(5)
        this.addPhysics()
        this.setImmovable(true)
        this.addParticles()
    }

    private addPhysics() {
        this.scene.physics.add.existing(this);
        this.setSize(this.displayWidth, this.displayHeight)
        this.setCollideWorldBounds(true)
    }

    private addParticles() {
        var particles = this.scene.add.particles('smokeblock');

        this.emitter = particles.createEmitter({
            lifespan: 750,
            speed: 30,
            scale: { start: 0.1, end: 0.05 },
        });
    };

    public update() {
        if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
            this.emitter.startFollow(this)
            this.emitter.start()
        } else {
            this.emitter.stop()
        }

        //fading particles
        this.emitter.forEachAlive(function (particle) {
            particle.alpha = particle.life / 1000, 0, 1;
        }, this);

        this.setImmovable(true)
    }
}