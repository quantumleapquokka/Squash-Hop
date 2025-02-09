// Game Title: Squash Hop
// Name: Samantha Siew
// Hours Spent:
/*Creative Tilt:

*/
'use strict'

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1000,
    scene: [ Menu, Play, Credits ]
}
let game = new Phaser.Game(config)

// Key bindings
let keySPACE

// UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3