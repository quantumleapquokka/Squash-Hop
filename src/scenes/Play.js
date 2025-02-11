class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        this.highScore = localStorage.getItem("highScore") || 0
        this.score = 0

        this.sound.play('music')
        console.log("play scene for squash hop")

        // place tile sprite
        this.gradient = this.add.tileSprite(400, 500, 800, 4000, 'background').setOrigin(0.5, 0.75 )
        
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

        // spawning
        this.time.addEvent({
            delay: 1000, // Adjust spawn rate
            callback: () => {
                let highestY = Math.min(...this.plats.getChildren().map(p => p.y))
                this.spawnPlatform(Phaser.Math.Between(100, 700), highestY - 200)
            },
            loop: true
        })
        
        // blob animation configuration
        if (!this.anims.exists('jump')) {
            this.anims.create({
                key: 'jump',
                frames: this.anims.generateFrameNumbers('blob', { start: 0, end: 2 }),
                frameRate: 8,
            })
        }
        
        if (!this.anims.exists('death')) {
            this.anims.create({
                key: 'death',
                frames: [{ key: 'blob', frame: 3 }],
                frameRate: 1
            })
        } 

        // display score
        this.scoreText = this.add.text(20, 20, "Score: 0", {
            backgroundColor: "#000",
            fontSize: "32px",
            fill: "#fff"
        }).setScrollFactor(0)

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)

        this.gameOver = false
        this.input.keyboard.on('keydown-F', () => {
            console.log("F key event triggered")
            this.sound.play('select')
            this.scene.start("menuScene")
        })
    }

    startGame() {
        this.startText.destroy()
        this.gameStarted = true
    }

    checkCollision(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width &&
            obj1.x + obj1.width > obj2.x &&
            obj1.y < obj2.y + obj2.height &&
            obj1.y + obj1.height > obj2.y
        )
    }

    update() {
        if (!this.gameStarted) {
            return
        } 
        

        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            console.log("F key pressed")
            this.sound.play('select')
            this.scene.start("menuScene")
        }
        
        this.cameras.main.scrollY -= 1
        this.gradient.tilePositionY -= .1

        if (this.gradient.y > this.cameras.main.scrollY + game.config.height) {
            this.gradient.y -= game.config.height
        }

        // extend boundaries
        this.blob.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, this.cameras.main.scrollY, game.config.width, game.config.height + Math.abs(this.cameras.main.scrollY)))

        this.plats.children.iterate((platform) => {
            if (!platform) return

            if (this.gameStarted) {
                if (platform.x <= 50) {
                    platform.setVelocityX(Math.abs(platform.speed))
                } else if (platform.x >= 750) {
                    platform.setVelocityX(-Math.abs(platform.speed))
                }
            }

            if (platform.x <= 50) {
                platform.setVelocityX(Math.abs(platform.speed))
            } else if (platform.x >= 750) {
                platform.setVelocityX(-Math.abs(platform.speed))
            }

            if (!platform.passed && this.blob.y < platform.y) {
                this.score++
                this.scoreText.setText("Score: " + this.score)
                platform.passed = true
            }

            if (platform.y > this.cameras.main.scrollY + game.config.height) {
                platform.destroy() // Remove platforms that are off-screen
            }

            if (this.checkCollision(this.blob, platform)) {
                this.sound.play('land')
            }
        })
        

        // Player jump logic
        if (Phaser.Input.Keyboard.JustDown(keySPACE )) {
            this.sound.play('jump')
            this.blob.body.setVelocityY(-500)
            this.blob.play('jump', true)
        }

        // Game Over Conditions
        if (this.blob.y > this.cameras.main.scrollY + game.config.height) {
            this.gameOver = true;
            this.endText = this.add.text(400, 300, "GAME OVER", {
                backgroundColor: "#000",
                fontSize: "32px",
                fill: "#fff"
            }).setOrigin(0.5).setScrollFactor(0)

            this.sound.play('squish')
            this.blob.play('death', true)
            this.gameStarted = false
            
            // Stop blob movement
            this.blob.body.setVelocity(0, 0) 
            this.blob.body.allowGravity = false

            // Keep it on the ground
            this.blob.y = this.cameras.main.scrollY + game.config.height - 50
            //keySPACE.enabled = false

            this.endText = this.add.text(400, 600, "PRESS [F] TO RETURN TO MAIN MENU", {
                backgroundColor: "#000",
                fontSize: "32px",
                fill: "#fff"
            }).setOrigin(0.5).setScrollFactor(0)

        }

        if (this.gameOver) {
            if (this.score > this.highScore) {
                this.highScore = this.score
                localStorage.setItem("highScore", this.highScore)
            }
        }
    }

    spawnInitialPlatforms() {
        let yPos = 800
        for (let i = 0; i < 3; i++) {
            this.spawnPlatform(Phaser.Math.Between(100, 700), yPos)
            yPos -= 300
        }
    }


    spawnPlatform(x,y) {
        let minSpeed = this.score > 5 ? 100 : 20
        let maxSpeed = this.score > 5 ? 700 : 500

        let platform = this.plats.create(x, y, 'platform').setImmovable(true)
        platform.setImmovable(true)
        platform.body.allowGravity = false
        this.physics.add.collider(this.blob, platform)
        platform.speed = Phaser.Math.Between(minSpeed, maxSpeed) * (Math.random() < 0.5 ? 1 : -1)  
        platform.setVelocityX(platform.speed)
        
        return platform
    }

    onLand(blob, platform) {
        this.sound.play('land')
        let highestY = Math.min(...this.plats.getChildren().map(p => p.y))
    
        // Spawn a new platform above the highest one
        this.spawnPlatform(Phaser.Math.Between(100, 700), highestY - 200)
        
        if (blob.body.touching.down) {
            let highestY = Math.min(...this.plats.getChildren().map(p => p.y))
            this.spawnPlatform(Phaser.Math.Between(100, 700), highestY - 200)
        }
    }
}