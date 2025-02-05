class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene")
    }

    create() {
        this.add.text(20, 20, "menu scene for squash hop")

        // skip to play scene for debugging
        this.scene.start("playScene")
    }
    
}