class Play2 extends Phaser.Scene {
    constructor() {
        super("level2");
    }

    preload() {
        this.load.image('tileset.png', 'assets/tileset.png');
        this.load.image('player', 'assets/scientist.png');
        this.load.image('enemy', 'assets/Alien.png');
        this.load.image('sector', 'assets/sector.png');
        this.load.tilemapTiledJSON('tilesets2', 'assets/teleport.json');
        this.load.audio('footsteps', './assets/footsteps.wav');
        this.load.audio('theme', './assets/title theme.wav');
        this.load.image('closedDoor', './assets/tileSprites/closedDoor.png')
        this.load.image('openDoor', './assets/tileSprites/openDoor.png')
    }

    playMusic() {
        this.bgm = this.sound.add('theme',{volume: 0.2,loop:true});
        this.bgm.play();
    }

    create() {
        this.paused = false;
        this.DefineInputs();
        currentLevel = 'level2';

        const map = this.make.tilemap({ key: 'tilesets2' });
        const tileset = map.addTilesetImage('tileset', 'tileset.png');
        map.createLayer('Floor', tileset);
        this.mask = map.createLayer('Mask', tileset);
        this.obstacles = map.createLayer('Wall', tileset);
        this.events = map.objects[0].objects;
        this.spawnXY = this.events.find((event)=>{return event.name === "respawn"});
        this.tempVent = this.events.find((event)=>{return event.name === "VentIn"
                                                    && event.type == 1});
        this.tempVentOut = this.events.find((event)=>{return event.name === "VentOut"
                                                        && event.type == 1});
        this.tempVent1 = this.events.find((event)=>{return event.name === "VentIn"
                                                        && event.type == 2});
        this.tempVentOut1 = this.events.find((event)=>{return event.name === "VentOut"
                                                        && event.type == 2});
        this.Exit = this.events.find((event)=>{return event.name === "Exit"});
        console.log(this.tempVent,this.tempVentOut);
        this.enemy1path = this.events.find((event)=>{return event.name === "path"
                                                        && event.type == 1});
        this.pickupXY = this.events.find((event)=>{return event.name === "Teleporter"});
        this.objects = map.createLayer('Object', tileset);
        
        
        // Phyiscs Bodies include player, enemies, enemy detections
        this.CreatePhysicsBodies();

        //this.enemy1.cone.body.setCircle(30);
        //this.enemy1.cone.body.setOffset(30,30);

        // Sets up camera zoom, allows it to follow player
        this.SetCamera(map);
        
        // Sets up all collisions between player, enemy, obstacles
        this.CreateCollisionEvents();


        // This launches the pause screen whenever ESC is pressed
        if (!eventListenerAdded) {
            window.addEventListener('keydown', (e) => this.checkPause(e.key));
            eventListenerAdded = true;
        }
        map.createLayer('Overhead', tileset);
        this.scene.launch("HUDScene");

        this.player.ready.dash = true;
        this.player.count.invisibility = 0;
        this.player.count.teleport = 0;
    }

    DefineInputs() {
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    SetCamera(map) {
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.player, false, 0.08, 0.08, 0, 0);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    CreatePhysicsBodies() {
        this.player = new Player(this, this.spawnXY.x, this.spawnXY.y, 'player');
        this.enemy1 = new Enemy(this, this.enemy1path.x + this.enemy1path.polygon[0].x,
            this.enemy1path.y + this.enemy1path.polygon[0].y, 'enemy');
        this.enemy1.depth = 10;
        this.enemy1.path = this.enemy1path;
        this.enemy1.cone = new Cone(this.enemy1.detectionDistance, this, this.enemy1.x,
            this.enemy1.y, 'sector');
        this.enemy1.cone.depth = 2;
        this.enemy1.colCone = new Cone(this.enemy1.detectionDistance, this, this.enemy1.x,
            this.enemy1.y, 'sector');
        this.add.existing(this.player);
        this.physics.add.existing(this.player);
        this.add.existing(this.enemy1);
        this.physics.add.existing(this.enemy1);
        this.add.existing(this.enemy1.cone);
        this.physics.add.existing(this.enemy1.cone);
        this.add.existing(this.enemy1.colCone);
        this.physics.add.existing(this.enemy1.colCone);
        this.enemy1.colCone.alpha = 0;
        this.player.body.setSize(16, 8);
        this.player.body.setOffset(8, 22);
        this.enemy1.body.setSize(16, 8);
        this.enemy1.body.setOffset(8, 22);

        this.pickup = this.physics.add.image(this.pickupXY.x, this.pickupXY.y, 'teleportSprite');
        this.pickup.setImmovable(true);
    }

    CreateCollisionEvents() {
        this.objects.setCollisionByProperty({ collides: true });
        this.obstacles.setCollisionByExclusion([-1]);
        this.objects.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.collider(this.player, this.objects);
        //this.physics.add.collider(this.enemy1, this.objects);
        this.physics.add.overlap(this.enemy1.cone, this.player);
        this.physics.add.collider(this.player, this.enemy1, (player, enemy1) => {
            this.paused = true;
            this.player.sfx.stop();
            this.scene.restart();
            this.player.x = this.spawnXY.x;
            this.player.y = this.spawnXY.y;
        });
        this.physics.add.collider(this.enemy1, this.obstacles);
        this.physics.add.collider(this.enemy1.colCone, this.obstacles,
            (colCone, obstacles) => {});
        if (this.closedDoor) {
            this.physics.add.collider(this.closedDoor, this.player, () => { 
                if(keyF.isDown) { 
                    this.closedDoor.destroy();
                    this.openDoor = this.physics.add.image(500, 500, 'openDoor');
                    this.openDoor.setImmovable(true);
                }
            });
        }
    }

    stopDash() {
        this.player.stopDash();
    }

    update() {
        this.player.update();
        this.enemy1.update();
        //console.log(this.player.x,this.player.y);
        if(this.distanceBetween(
            this.player.x, this.player.y,
            this.Exit.x, this.Exit.y) < 24){
                // Make it start the next level
                //game.prompt.text = "This is the exit.";
                this.scene.stop();
                this.scene.stop("HUDScene");
                this.scene.start("level2");
                this.sound.stopAll();

        }
        if(this.distanceBetween(
            this.player.x, this.player.y,
            this.tempVent.x, this.tempVent.y) < 24){
            if (Phaser.Input.Keyboard.JustDown(keyF)) {
                this.player.x = this.tempVentOut.x;
                this.player.y = this.tempVentOut.y;
            }
        }
        if(this.distanceBetween(
            this.player.x, this.player.y,
            this.tempVentOut.x, this.tempVentOut.y) < 24){
            game.prompt.text =  "Press F to go through the vent";
            if (Phaser.Input.Keyboard.JustDown(keyF)) {
                this.player.x = this.tempVent.x;
                this.player.y = this.tempVent.y;
            }
        }
        if(this.distanceBetween(
            this.player.x, this.player.y,
            this.tempVent1.x, this.tempVent1.y) < 24){
            game.prompt.text =  "Press F to go through the vent";
            if (Phaser.Input.Keyboard.JustDown(keyF)) {
                this.player.x = this.tempVentOut1.x;
                this.player.y = this.tempVentOut1.y;
                game.prompt.text = "Keep your distance from the Alien. He can see the area highlighted in yellow"+
                                    "\nHe can also hear your footsteps from a smaller range. Find your way out.";
            }
        }
        if(this.distanceBetween(
            this.player.x, this.player.y,
            this.tempVentOut1.x, this.tempVentOut1.y) < 24){
            game.prompt.text =  "Press F to go through the vent";
            if (Phaser.Input.Keyboard.JustDown(keyF)) {
                this.player.x = this.tempVent1.x;
                this.player.y = this.tempVent1.y;
            }
        }
        if(this.distanceBetween(
            this.player.x, this.player.y,
            this.pickup.x,  this.pickup.y) < 32){
            this.player.count.teleport = 3;
            this.pickup.destroy();
        }
    }

    distanceBetween(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
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