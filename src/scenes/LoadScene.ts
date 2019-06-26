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

    this.load.spritesheet("monster", require("../assets/image/monster.png"), {
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

    this.load.image("restart_button", require("../assets/image/restart_button.png"));
    this.load.image("menu_button", require("../assets/image/menu_button.png"));
    this.load.image("play_button", require("../assets/image/play_button2.png"));
    this.load.image("options_button", require("../assets/image/options_button2.png"));
    this.load.image("background", require("../assets/image/background2.jpg"));

    this.load.spritesheet("smoke", require("../assets/image/smoke.gif"), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("blood", require("../assets/image/blood.png"), {
      frameWidth: 250,
      frameHeight: 300
    });

    this.load.spritesheet("smokeblock", require("../assets/image/smokeblock.png"), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("characterUlt", require("../assets/image/adventurer.png"), {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("characterPush", require("../assets/image/buffguy.png"), {
      frameWidth: 32,
      frameHeight: 32
    });
  }


  preload() {
    this.loadImages();

    this.load.audio('theme', '..assets/audio/menu.mp3')
    //load map
    this.load.image("Dungeon", require("../assets/image/tileset_dungeon2.png"));
    this.load.tilemapTiledJSON("mappy", require("../assets/maps/level1.json"));

    // level 1
    this.load.tilemapTiledJSON("play1", require("../assets/maps/play1.json"));

    //opening map
    this.load.tilemapTiledJSON("openingScene", require("../assets/maps/test.json"));

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

    // //simulate large load
    // for (let i = 0; i < 125; i++) {
    //   this.load.spritesheet("cat" + i, "./assets/monster.png", {
    //     frameHeight: 32,
    //     frameWidth: 32
    //   });
    // }
  }
}
