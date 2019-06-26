import { PlayScene } from "../scenes/PlayScene"

export class bait extends Phaser.Physics.Arcade.Sprite {

    private playScene: PlayScene
    private Keyboard: any


    constructor(scene: Phaser.Scene, x:number , y:number) {
        super(scene, x, y , "bait", 50 )

        this.scene.add.existing(this)
        this.setDepth(5);
        this.addPhysics()
        this.setDepth(0)
    }

    private addPhysics() {
        this.scene.physics.add.existing(this);
        this.setSize(this.displayWidth, this.displayHeight)
        this.setCollideWorldBounds(true)
    }

}