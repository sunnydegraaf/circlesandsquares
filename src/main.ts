import "phaser";
import { Arcade } from "./utils/arcade"
import { LoadScene } from "./scenes/LoadScene";
import { MenuScene } from "./scenes/MenuScene";
import { OpeningScene } from "./scenes/OpeningScene";
import { PlayScene } from "./scenes/PlayScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { TestScene } from "./scenes/TestScene";



const config: Phaser.Types.Core.GameConfig = {
  width: 640,
  height: 480,
  scene: [LoadScene, MenuScene, OpeningScene, PlayScene, GameOverScene, TestScene],
  render: {
    pixelArt: true
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}
 
export class MonsterHunter extends Phaser.Game {

  public arcade:Arcade

  constructor(config: Phaser.Types.Core.GameConfig) {
      super(config)

      // create the arcade once, otherwise we keep connecting/disconnecting every scene
      this.arcade = new Arcade()
  }
}

window.addEventListener("load", () => new MonsterHunter(config))

