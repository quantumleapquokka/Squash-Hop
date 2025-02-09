class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene")
    }

    create() {
        // background color
        this.cameras.main.setBackgroundColor('#bfa385'); 

        let creditsConfig = {
            fontFamily: 'times',
            fontSize: '80px',
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
        this.add.text(game.config.width/2, game.config.height/3 - borderUISize - borderPadding, '~CREDITS~', creditsConfig).setOrigin(0.5)
        creditsConfig.fontSize = '35px'
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - 90, '★彡♥~*~*~✧~*~*~♥彡★', creditsConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2, ' Visual Assets(sprites, ui, etc.): Samantha Siew', creditsConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Background Music:\n (my friend)Alasdair Lam\'s original composition', creditsConfig).setOrigin(0.5)

        creditsConfig.backgroundColor = '#9a6498'
        creditsConfig.color = '#000'
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 3 + borderPadding * 3, 'press [F] to go back to main menu', creditsConfig).setOrigin(0.5)
        
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    }

    update() {
        // skip to play scene for debugging
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.start("menuScene")
        }
        
    }
    
}