class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload() {
        this.load.image('Tilemap.png', 'assets/Tilemap.png');
        this.load.image('player', 'assets/tempdoc.png');
        this.load.image('enemy', 'assets/temp_enemy.png');
        this.load.tilemapTiledJSON('tilesets', 'assets/tempmap.json');
    }

    create() {
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        const map = this.make.tilemap({ key: 'tilesets' });
        const tileset = map.addTilesetImage('tilesets', 'Tilemap.png');
        map.createLayer('Background', tileset);
        this.obstacles = map.createLayer('Obstacles', tileset);
        this.events = map.objects[0].objects;
        this.spawnXY = this.events.find((event)=>{return event.name === "respawn"});
        this.enemy1path = this.events.find((event)=>{return event.name === "path"
                                                        && event.type == 1});
        console.log(this.events);
        console.log(this.enemy1path);
        map.createLayer('Foreground', tileset);
        this.cameras.main.setZoom(2);
        this.player = new Player(this, this.spawnXY.x, this.spawnXY.y, 'player');
        this.enemy1 = new Enemy(this, this.enemy1path.x + this.enemy1path.polygon[0].x,
                     this.enemy1path.y + this.enemy1path.polygon[0].y, 'enemy');
        this.enemy1.depth = 10;
        this.enemy1.path = this.enemy1path;
        this.add.existing(this.player);
        this.physics.add.existing(this.player);
        this.add.existing(this.enemy1);
        this.physics.add.existing(this.enemy1);
        
        this.cameras.main.startFollow(this.player, false, 0.08, 0.08, 0, 0);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.obstacles.setCollisionByProperty({ collides: true });
        this.obstacles.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.collider(this.player, this.enemy1);
        this.physics.add.collider(this.enemy1, this.obstacles);

        window.addEventListener('keydown', (e) => this.checkPause(e.key));
    }

    update() {
        this.player.update();
        this.enemy1.update();        
    }

    checkPause(key) {
        if (key == "Escape" && !this.paused) {
            this.paused = true;
            console.log("Paused: " + this.paused);
            this.scene.pause();
            this.scene.launch("pauseScene");
        } else if (key == "Escape" && this.paused) {
            this.paused = false;
            console.log("Paused: " + this.paused);
            this.scene.stop("pauseScene");
            this.scene.resume("tutorialScene");
        }
    }
}