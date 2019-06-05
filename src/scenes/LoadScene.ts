import { CST } from "../CST";
export class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.LOAD
    });
  }

  loadImages() {
    this.load.spritesheet("pushBlock", require("../assets/image/block.png"), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("monster", require("../assets/image/enemy.png"), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("characterBait", require("../assets/image/character.png"), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("bait", require("../assets/image/Food.png"), {
      frameWidth: 16,
      frameHeight: 16
  });

    this.load.image("play_button", require("../assets/image/play_button2.png"));
    this.load.image("options_button", require("../assets/image/options_button2.png"));
    this.load.image("background", require("../assets/image/background2.jpg"));

    this.load.spritesheet("smoke", require("../assets/image/smoke.gif"), {
      frameWidth: 32,
      frameHeight: 32
  });

  }

  preload() {
    this.loadImages();

    //load map
    this.load.image("Dungeon", require("../assets/image/tileset_dungeon2.png"));
    this.load.tilemapTiledJSON("mappy", require("../assets/maps/level1.json"));

    // loading bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(160.5, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });

    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    // @ts-ignore
    this.load.on('progress', function (value) {
      // @ts-ignore
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(175.5, 280, 290 * value, 30);
    });

    // @ts-ignore
    this.load.on('fileprogress', function (file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();

      this.scene.start(CST.SCENES.MENU);
    });

    //simulate large load
    for (let i = 0; i < 200; i++) {
      this.load.spritesheet("cat" + i, "./assets/cat.png", {
        frameHeight: 32,
        frameWidth: 32
      });
    }
  }
}
