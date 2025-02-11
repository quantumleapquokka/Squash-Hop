// Game Title: Squash Hop
// Name: Samantha Siew
// Hours Spent: 27
/*Creative Tilt:
        In my game, I was able to keep track of score that is stored within the browser, so even if the player refreshes the page, their high score
        stays the same. This was a new concept to me, as I had to google how to save and load player scores in local storage. The code can be found in Play.js,
        where the high scores are kept.

        As for something visually and audibly, the gradient background was something that I thought would be cool to have so the player can see themselves scrolling up. 
        Additionally, I thought having the background music be calming would be a nice contrast to how the game becomes more intense as the platform speeds increase.
        The background music is also a real recording of my friend's composition.
*/
'use strict'

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 1000,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ Menu, Play, Credits ]
}
let game = new Phaser.Game(config)

// Key bindings
let keySPACE
let keyF

// UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
let { width, height } = game.config