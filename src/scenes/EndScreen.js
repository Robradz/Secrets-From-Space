class EndScreen extends Phaser.Scene {

    constructor() {
        super("endScreenScene");
    }

    preload() {
        this.load.image('background', '../../assets/Menu_1.png');
    }

    create() {
        this.add.image(game.config.width / 2, 
            game.config.height / 2 ,'background').setScale(1.7, 1.5).setAlpha(0.25);
    
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

        // Escape message
        this.title = this.add.text(
            game.config.width - 49, 
            game.config.height/2 - 149, 
            'You Escaped!', 
            menuConfig).setOrigin(1, 0.5).setFontSize(44);

        this.title = this.add.text(
            game.config.width - 50, 
            game.config.height/2 - 150, 
            'You Escaped!', 
            menuConfig).setOrigin(1, 0.5).setFontSize(44).setColor('#000');
        
        // Menu BUTTON
        this.playButton = this.add.text(
            game.config.width - 48,
            game.config.height/2 - 50, 
            'Menu', 
            {align: 'right', fontFamily: 'potra', fill: '#000'}).setOrigin(1, 0).setFontSize(72);

        this.playButton = this.add.text(
            game.config.width - 50,
            game.config.height/2 - 52, 
            'Menu', 
            {align: 'right', fontFamily: 'potra', fill: '#2080FF'}).setOrigin(1, 0).setFontSize(72);
        this.playButton.setInteractive();
        this.playButton.on('pointerover', 
            () => { this.playButton.setStyle({ fill: '#0aa'}) });
        this.playButton.on('pointerout', 
            () => { this.playButton.setStyle({ fill: '#2080FF'}) });
        this.playButton.on('pointerup', 
            () => { this.scene.start('menuScene'); });

        // TUTORIAL
        this.tutorialButton = this.add.text(
            game.config.width - 48, 
            game.config.height/2 + 30, 
            'Credits', 
            {align: 'right', fontFamily: 'potra', fill: '#000'}).setOrigin(1, 0).setFontSize(40);

        this.tutorialButton = this.add.text(
            game.config.width - 50, 
            game.config.height/2 + 28, 
            'Credits', 
            {align: 'right', fontFamily: 'potra', fill: '#2080FF'}).setOrigin(1, 0).setFontSize(40);
        this.tutorialButton.setInteractive();
        this.tutorialButton.on('pointerover', 
            () => { this.tutorialButton.setStyle({ fill: '#0aa'}) });
        this.tutorialButton.on('pointerout', 
            () => { this.tutorialButton.setStyle({ fill: '#2080FF'}) });
        this.tutorialButton.on('pointerup', 
            () => { this.scene.start('creditsScene'); });
    }
}