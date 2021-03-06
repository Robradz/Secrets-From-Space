class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
        currentLevel = 'tutorialScene';
    }

    preload() {
        this.load.audio('theme', './assets/title theme.wav');
        this.load.audio('spotted', './assets/spotted.wav');
        this.load.audio('picked', './assets/picked.wav');
        this.load.image('background', './assets/Menu_1.png');
    }

    create() {
        this.add.image(game.config.width / 2, 
            game.config.height / 2 ,'background').setScale(1.7, 1.5);

        let menuConfig = {
            fontFamily: 'locust',
            fontSize: '28px',
            color: '#2681FF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // TITLE
        this.title = this.add.text(
            game.config.width - 49, 
            game.config.height/2 - 149, 
            'Secrets From Space', 
            menuConfig).setOrigin(1, 0.5).setFontSize(44);

        this.title = this.add.text(
            game.config.width - 50, 
            game.config.height/2 - 150, 
            'Secrets From Space', 
            menuConfig).setOrigin(1, 0.5).setFontSize(44).setColor('#000');
        
        // PLAY BUTTON
        this.playButton = this.add.text(
            game.config.width - 48,
            game.config.height/2 - 50, 
            'Play', 
            {align: 'right', fontFamily: 'potra', fill: '#000'}).setOrigin(1, 0).setFontSize(72);

        this.playButton = this.add.text(
            game.config.width - 50,
            game.config.height/2 - 52, 
            'Play', 
            {align: 'right', fontFamily: 'potra', fill: '#2080FF'}).setOrigin(1, 0).setFontSize(72);
        this.playButton.setInteractive();
        this.playButton.on('pointerover', 
            () => { this.playButton.setStyle({ fill: '#0aa'}) });
        this.playButton.on('pointerout', 
            () => { this.playButton.setStyle({ fill: '#2080FF'}) });
        this.playButton.on('pointerup', 
            () => { this.scene.start(currentLevel); });

        // Credits
        this.creditsButton = this.add.text(
            game.config.width - 48, 
            game.config.height/2 + 30, 
            'Credits', 
            {align: 'right', fontFamily: 'potra', fill: '#000'}).setOrigin(1, 0).setFontSize(40);

        this.creditsButton = this.add.text(
            game.config.width - 50, 
            game.config.height/2 + 28, 
            'Credits', 
            {align: 'right', fontFamily: 'potra', fill: '#2080FF'}).setOrigin(1, 0).setFontSize(40);
        this.creditsButton.setInteractive();
        this.creditsButton.on('pointerover', 
            () => { this.creditsButton.setStyle({ fill: '#0aa'}) });
        this.creditsButton.on('pointerout', 
            () => { this.creditsButton.setStyle({ fill: '#2080FF'}) });
        this.creditsButton.on('pointerup', 
            () => { this.scene.start('creditsScene'); });
        

        this.game.sound.stopAll();
        this.bgm = this.sound.add('theme',{volume: 0.2,loop:true});
        this.bgm.play();
    }
}