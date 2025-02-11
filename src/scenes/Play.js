class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // this.add.text(20, 20, "play scene for squash hop")

        // place tile sprite
        this.gradient = this.add.tileSprite(400, 500, 800, 2000, 'background').setOrigin(0.5, 0.75)
        
        // add borders
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x00000).setOrigin(0, 0).setScrollFactor(0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x00000).setOrigin(0, 0).setScrollFactor(0)

        // Physics group for moving platforms
        this.plats = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })


        // add blob
        this.blob = new Blob(this, 400, 928, 'blob')
        this.add.existing(this.blob)

        // Add start message
        this.startText = this.add.text(400, 300, "Press SPACE to Start", {
            fontSize: "32px",
            fill: "#fff"
        }).setOrigin(0.5)

        // Disable movement before start
        this.gameStarted = false

        // Listen for space key
        this.input.keyboard.once('keydown-SPACE', () => {
            this.startGame()
        })

        
        this.spawnInitialPlatforms() 

        this.physics.add.collider(this.blob, this.plats)

        // testing platform
        // let oneWay = this.plats.create(400  
        
        // platform/blob collision
        // Collision detection
        this.physics.add.collider(this.blob, this.plats, this.onLand, null, this)
        // this.physics.add.collider(this.blob, this.plats)
        // this.physics.add.collider(this.blob, this.platLeft)
        // this.physics.add.collider(this.blob, this.platRight)
        this.time.addEvent({
            delay: 1000, // Adjust spawn rate
            callback: () => {
                let highestY = Math.min(...this.plats.getChildren().map(p => p.y));
                this.spawnPlatform(Phaser.Math.Between(100, 700), highestY - 200);
            },
            loop: true
        })
        
        // blob animation configuration
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('blob', {start: 0, end: 2}),
            frameRate: 8,
        })

        this.blob.on('animationcomplete', (animation) => {
            this.time.delayedCall(1000, () => { 
                this.blob.setFrame(0)  // Reset to first sprite frame
            })    
        })

        this.anims.create({
            key: 'death',
            frames: [{ key: 'blob', frame: 3 }], 
            frameRate: 1
        })

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    startGame() {
        this.startText.destroy()
        this.gameStarted = true
    }

    update() {
        if (!this.gameStarted) return
        
        this.cameras.main.scrollY -= 1
        this.gradient.tilePositionY -= 1

        this.plats.children.iterate((platform) => {
            if (!platform) return

            if (platform.x <= 50) {
                platform.setVelocityX(Math.abs(platform.speed)); // Move right
            } else if (platform.x >= 750) {
                platform.setVelocityX(-Math.abs(platform.speed)); // Move left
            }

            if (platform.y > this.cameras.main.scrollY + game.config.height) {
                platform.destroy(); // Remove platforms that are off-screen
            }
        })
        

        // Player jump logic
        if (Phaser.Input.Keyboard.JustDown(keySPACE )) {
            this.blob.body.setVelocityY(-500)
            this.blob.play('jump', true)
        }

        // Game Over Conditions
        if (this.blob.y > this.cameras.main.scrollY + game.config.height) {
            this.scene.restart(); // Game over if the blob falls
        }  
    }

    checkDeath() {
        // If Blob is not touching either moving platform, it dies
        // if (!this.physics.overlap(this.blob, this.platLeft) && !this.physics.overlap(this.blob, this.platRight)) {
        //     this.sound.play('squish')
        //     this.time.delayedCall(1000, () => {
        //         this.scene.restart()
        //     });
        // }
    }

    spawnInitialPlatforms() {
        let yPos = 800
        for (let i = 0; i < 3; i++) {
            this.spawnPlatform(Phaser.Math.Between(100, 700), yPos)
            yPos -= 300
        }
    }


    spawnPlatform(x,y) {
        let platform = this.plats.create(x, y, 'platform').setImmovable(true)
        platform.setImmovable(true)
        platform.body.allowGravity = false
        this.physics.add.collider(this.blob, platform)
        platform.speed = Phaser.Math.Between(10, 200) * (Math.random() < 0.5 ? 1 : -1)  
        platform.setVelocityX(platform.speed)
        return platform
    }

    onLand(blob, platform) {
        let highestY = Math.min(...this.plats.getChildren().map(p => p.y))
    
        // Spawn a new platform above the highest one
        this.spawnPlatform(Phaser.Math.Between(100, 700), highestY - 200)
        
        if (blob.body.touching.down) {
            let highestY = Math.min(...this.plats.getChildren().map(p => p.y))
            this.spawnPlatform(Phaser.Math.Between(100, 700), highestY - 200)
        }
    }
}