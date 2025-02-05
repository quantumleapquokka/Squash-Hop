let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1000,
    scene: [ Menu, Play, Credits ]
}
let game = new Phaser.Game(config)