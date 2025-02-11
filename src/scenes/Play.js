class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    create() {
        // this.add.text(20, 20, "play scene for squash hop")

        // place tile sprite
        this.gradient = this.add.tileSprite(400, 500, 800, 2000, 'background').setOrigin(0.5, 0.75)
        
        // add borders
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0x00000).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x00000).setOrigin(0, 0)

        // Physics group for moving platforms
        this.plats = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        // // jump platforms 
        // this.platLeft = this.physics.add.sprite(0, height / 4 * 3, 'platform').setOrigin(0, 0).setImmovable(true)
        // this.platRight = this.physics.add.sprite(800, height / 4 * 3, 'platform').setOrigin(1, 0).setImmovable(true)

        // add blob
        this.blob = new Blob(this, 400, 928, 'blob')
        this.add.existing(this.blob)

        
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

        // this.tweens.add({
        //     targets: [this.platLeft, this.platRight],
        //     x: 400, 
        //     duration: Phaser.Math.Between(2000, 5000),
        //     ease: 'Linear',
        //     onComplete: () => {
        //         this.checkDeath()
        //     }
        // })

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    }

    update() {
        this.plats.children.iterate((platform) => {
            if (platform.x <= 50) {
                platform.setVelocityX(Math.abs(platform.speed)); // Move right
            } else if (platform.x >= 750) {
                platform.setVelocityX(-Math.abs(platform.speed)); // Move left
            }
        })
        

        // Player jump logic
        if (Phaser.Input.Keyboard.JustDown(keySPACE )) {
            this.blob.body.setVelocityY(-500)
            this.blob.play('jump', true)
        }

        // Game Over Conditions
        if (this.blob.y > game.config.height || this.blob.x < 0 || this.blob.x > game.config.width) {
            this.scene.restart()
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
        // let yPos = this.blob.y - 100;  // Spawn new platform above the Blob
        // this.platLeft = this.physics.add.sprite(0, height / 4 * 3, 'platform').setOrigin(0, 0).setImmovable(true)
        // this.platRight = this.physics.add.sprite(800, height / 4 * 3, 'platform').setOrigin(1, 0).setImmovable(true)
        // // let leftPlat = this.plats.create(-100, yPos, 'platform').setOrigin(0, 0).setImmovable(true)
        // // let rightPlat = this.plats.create(900, yPos, 'platform').setOrigin(1, 0).setImmovable(true)

        // // Move platforms inward
        // // this.tweens.add({
        // //     targets: [leftPlat, rightPlat],
        // //     x: (target) => (target === leftPlat ? 400 - leftPlat.displayWidth / 2 : 400 + rightPlat.displayWidth / 2),
        // //     duration: Phaser.Math.Between(2000, 4000),
        // //     ease: 'Linear'
        // // })
        // this.tweens.add({
        //     targets: [this.platLeft, this.platRight],
        //     x: 400, 
        //     duration: Phaser.Math.Between(2000, 5000),
        //     ease: 'Linear',
        //     onComplete: () => {
        //         this.checkDeath()
        //     }
        // })

        
        // this.physics.add.collider(this.blob, this.platLeft)
        // this.physics.add.collider(this.blob, this.platRight)

        // // Store reference to current platform
        // this.currentPlatform = { left: this.leftPlat, right: this.rightPlat }
    }

    onLand(blob, platform) {
        if (blob.body.touching.down) {
            let highestY = Math.min(...this.plats.getChildren().map(p => p.y))
            this.spawnPlatform(Phaser.Math.Between(100, 700), highestY - 200)
        }
    }
}