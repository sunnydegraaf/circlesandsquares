import { CST } from "../CST";
import { throws } from "assert";

export class GameOverScene extends Phaser.Scene {

    private restartTween: Phaser.Tweens.Tween
    private menuTween: Phaser.Tweens.Tween


    constructor() {
        super({
            key: "gameover"
        });
    }

    create() {
        document.addEventListener("joystick1button0", () => this.nextGame())

        let restartButton = this.add
            .image(
                this.game.renderer.width / 2,
                this.game.renderer.height / 2,
                "restart_button"
            )
            .setDepth(1);

        let menuButton = this.add
            .image(
                this.game.renderer.width / 2,
                this.game.renderer.height / 2 + 100,
                "menu_button"
            )
            .setDepth(1);

        restartButton.setInteractive();


        restartButton.on("pointerover", () => {
            this.restartTween = this.tweens.add({
                targets: restartButton,
                alpha: 0.8,
                scaleX: 1.2,
                scaleY: 1.2,
                ease: 'Cubic.easeInOut',
                duration: 400,
                yoyo: true,
                repeat: -1,
            })
        })

        restartButton.on("pointerout", () => {
            restartButton.setScale(1)
            this.tweens.remove(this.restartTween)
        })

        restartButton.on("pointerup", () => {
            if (localStorage.getItem('prevScene') === 'opening') {
                this.scene.start(CST.SCENES.OPENING)

            } else {
                this.scene.start(CST.SCENES.PLAY)

            }
        })

        menuButton.setInteractive();

        menuButton.on("pointerup", () => {
            this.scene.start(CST.SCENES.MENU);
        });

        menuButton.on("pointerover", () => {
            this.menuTween = this.tweens.add({
                targets: menuButton,
                alpha: 0.8,
                scaleX: 1.2,
                scaleY: 1.2,
                ease: 'Cubic.easeInOut',
                duration: 400,
                yoyo: true,
                repeat: -1,
            })
        })

        menuButton.on("pointerout", () => {
            menuButton.setScale(1)
            this.tweens.remove(this.menuTween)
        })


        this.add
            .image(0, 0, "background")
            .setOrigin(0)
            .setDepth(0);
    }

    private nextGame() {
        this.scene.start(CST.SCENES.MENU)
    }


}