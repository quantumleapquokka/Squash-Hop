class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // this.add.text(20, 20, "play scene for squash hop")

        // place tile sprite
        this.gradient = this.add.tileSprite(400, 500, 800, 2000, 'background').setOrigin(0.5, 0.75)
        
        // add borders
        // this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        // this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        // this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)


        this.plats = this.physics.add.staticGroup()

        // add base platform
        this.plats.create(400, 980, 'platform').setScale(4, 1).refreshBody()

        // jump platforms 
        let platLeft = this.plats.create(0, height / 4 * 3, 'platform').setOrigin(0, 0)
        let platRight = this.plats.create(800, height / 4 * 3, 'platform').setOrigin(1, 0)

        // add blob
        this.blob = new Blob(this, 400, 928, 'blob')
        this.add.existing(this.blob)

        // testing
        let oneWay = this.plats.create(400, height / 4 * 3, 'platform')
        oneWay.body.checkCollision.down = false
        
        // base/blob collision
        this.physics.add.collider(this.blob, this.base)
        
        // platform/blob collision
        this.physics.add.collider(this.blob, this.plats)

    }

    update() {
        this.gradient.y = Math.max(this.blob.y, 500)

        if (this.gradient.y < 500) {
            this.gradient.y = 500;
        }

        this.blob.update();
    }
}