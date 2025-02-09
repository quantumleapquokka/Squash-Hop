class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    preload() {
        // load sprites and tiles
        this.load.image('background', './assets/background.png')
        this.load.image('platform', './assets/platform.png')
        
        // load spritesheet 
        this.load.spritesheet('blob', './assets/blob.png', {
            frameWidth: 64,
            frameHeight: 64,
        })

        // load audio
        this.load.audio('music', './assets/bgm.wav');
        this.load.audio('jump', './assets/jump.wav')
        this.load.audio('land', './assets/land.wav')
        this.load.audio('select', './assets/select.wav')
        this.load.audio('squish', './assets/squish.wav')

    }

    create() {
        // blob animation configuration
        this.anims.create({
            key: 'blobJump',
            frames: this.anims.generateFrameNumbers('blob', {start: 0, end: 2}),
            frameRate: 8,
        })

        // background color
        this.cameras.main.setBackgroundColor('#b18fd0'); 

        let menuConfig = {
            fontFamily: 'fantasy',
            fontSize: '125px',
            color: '#513f60',
            backgroundColor: '',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
            aligh: 'center'
        }

        // display menu text
        this.add.text(game.config.width/2, game.config.height/3 - borderUISize - borderPadding, 'SQUASH HOP', menuConfig).setOrigin(0.5)
        menuConfig.fontSize = '50px'
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize, 'GAME INSTRUCTIONS', menuConfig).setOrigin(0.5)
        menuConfig.fontSize = '35px'
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - 90, '★彡♥~*~*~✧~*~*~♥彡★', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2, ' ~ use space bar to jump ~', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'jump in time before the platforms close \nand earn as many points as you can!\nsurvive as a blob and don\'t get squished!', menuConfig).setOrigin(0.5)

        menuConfig.backgroundColor = '#9a6498'
        menuConfig.color = '#000'
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 3 + borderPadding * 3, 'Press space to start!', menuConfig).setOrigin(0.5)
        
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update() {
        // skip to play scene for debugging
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start("playScene")
        }
        
    }
    
}