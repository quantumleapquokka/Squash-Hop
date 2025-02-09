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
        this.load.audio('bgm', './assets/Variations on an Original.wav')
        this.load.audio('jump', './assets/jump.wav')
        this.load.audio('land', './assets/land.wav')
        this.load.audio('select', './assets/select.wav')
        this.load.audio('squish', './assets/squish.wav')

    }

    create() {
        
        // skip to play scene for debugging
        this.scene.start("playScene")
    }
    
}