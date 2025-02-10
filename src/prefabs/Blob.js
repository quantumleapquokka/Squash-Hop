class Blob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y , texture) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.add. existing(this)

        this.setCollideWorldBounds(true)
        this.body.setGravityY(500)

        this.setDragX(1000)
        this.setFriction(1, 1)

        this.keySPACE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keySPACE)) {
            this.setVelocityY(-500)
        }
    }

}