"use strict";
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.detectionRadius = 8;
        this.detectionDistance = 60;
        this.visableDistance = 0;
        this.movementSpeed = 30;
        this.facing = "right";
        this.player = scene.player;
        this.scene = scene;
        this.movementStep = 1;
        this.isTrailing = false;
        this.lastPositionX = x;
        this.lastPositionY = y;
        this.sfx = scene.sound.add('spotted',{volume: 0.2});
    }

    update() {
         if(this.cone && this.colCone){
             this.cone.maskShape.x = this.x;
             this.cone.maskShape.y = this.y;
            this.cone.x = this.x;
            this.cone.y = this.y;
            this.cone.distance = this.visableDistance;
            this.cone.update();
            this.colCone.body.setCircle(this.visableDistance);  
            this.cone.body.setCircle(this.visableDistance + 24); 
            this.scene.physics.moveTo(this.colCone, 
                this.x,
                this.y,
                this.movementSpeed * 2, 100);

            this.cone.body.setOffset(
                this.detectionDistance - (this.visableDistance + 24), 
                this.detectionDistance - (this.visableDistance + 24));

             
         if(this.colCone.body.blocked.none){
             if(this.visableDistance < this.detectionDistance){
                this.visableDistance += 0.2;
             }
         }else{
            if(this.visableDistance > 0){
                this.visableDistance -= 0.2;
             }
         }
         
            
         if(this.visableDistance != this.detectionDistance){
            this.colCone.body.setOffset(
                this.detectionDistance - this.visableDistance, 
                this.detectionDistance - this.visableDistance);
         }
         }

        if(this.path && !this.isTrailing){
            this.scene.physics.moveTo(this, 
                this.path.x + this.getDestination().x,
                this.path.y + this.getDestination().y,
                this.movementSpeed);
            if(Math.abs(this.path.x + this.getDestination().x - this.x) < 1
              && Math.abs(this.path.y + this.getDestination().y - this.y) < 1){
                this.setVelocity(0, 0);
                this.movementStep++;
                this.movementStep = this.movementStep % 
                        (Object.getOwnPropertyNames(this.path.polygon).length - 1);
            }
        }

        if(this.isTrailing){
            if(Math.abs(this.player.body.velocity.x) 
                    == Math.abs(this.player.body.velocity.y)){
                if(Math.abs(this.player.x - this.x) > 2){
                    this.setVelocity(0, 0);
                    this.body.setVelocityY(0);
                    if(this.player.x - this.x > 0){
                        this.body.setVelocityX(this.movementSpeed);
                    }else{
                        this.body.setVelocityX(-this.movementSpeed);
                    }
                }
                if(Math.abs(this.player.y - this.y) > 2){
                    this.setVelocity(0, 0);
                    this.body.setVelocityX(0);
                    if(this.player.y - this.y > 0){
                        this.body.setVelocityY(this.movementSpeed);
                    }else{
                        this.body.setVelocityY(-this.movementSpeed);
                    }
                }
            }else{
                //console.log(this.player.body.velocity.x, this.player.body.velocity.y);
                if(Math.abs(this.player.x - this.x) > Math.abs(this.player.y - this.y)){
                    this.setVelocity(0, 0);
                    this.body.setVelocityY(0);
                    if(this.player.x - this.x > 0){
                        this.body.setVelocityX(this.movementSpeed);
                    }else{
                        this.body.setVelocityX(-this.movementSpeed);
                    }
                }
            if(Math.abs(this.player.y - this.y) > Math.abs(this.player.x - this.x)){
                    this.setVelocity(0, 0);
                    this.body.setVelocityX(0);
                    if(this.player.y - this.y > 0){
                        this.body.setVelocityY(this.movementSpeed);
                    }else{
                        this.body.setVelocityY(-this.movementSpeed);
                    }
                }
            }
        }

        this.updateDirection();
        if (this.player.state != "sneaking" &&
            this.player.state != "idle") {
            this.checkRadius();
        }
        
        if(!this.cone.body.touching.none){
            this.checkCone();
            }
        if (!this.player.alpha) {//hard to fix from the state side
            this.isTrailing = false;
        }
    }

    getTagetFacing(target) {
        let angle = Math.atan2( this.y - target.y, this.x - target.x);
        if((angle < Math.PI * (3/4) && angle > Math.PI * (1/4))){
            return "up";
        }
        if((angle > Math.PI * (-3/4) && angle < Math.PI * (-1/4))){
            return "down";
        }
        if((angle < Math.PI && angle > Math.PI * (3/4))||
        (angle < Math.PI * -(1/4) && angle > -Math.PI)){
            return "right";
        }
        if((angle < Math.PI * (1/4) && angle > 0)||
        (angle < 0 && angle > Math.PI * -(1/4))){
            return "left";
        }
    }

    checkCone() {
        // if (this.distanceBetween(this.x, this.y, this.player.x, this.player.y) 
        //     > this.visableDistance) { return; }
        let preState = this.isTrailing;
        if(this.facing == this.getTagetFacing(this.player)){
            if (this.facing == "right") {
               console.warn("Player caught by cone facing right");
               this.sfx.play();
            game.prompt.text = "the alien got attracted";
            this.isTrailing = true;
            } else if (this.facing == "left") {
               console.warn("Player caught by cone facing left");
               game.prompt.text = "the alien got attracted";
              this.isTrailing = true;
         } else if (this.facing == "up") {
               console.warn("Player caught by cone facing up");
               game.prompt.text = "the alien got attracted";
            this.isTrailing = true;
         } else if (this.facing == "down") {
                console.warn("Player caught by cone facing down");
              game.prompt.text = "the alien got attracted";
              this.isTrailing = true;
            }
        }
        if(!preState && this.isTrailing){
            this.sfx.play();
        }
    }

    distanceBetween(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
    }

    checkRadius() {
        if (this.distanceBetween(this.player.x, this.player.y, this.x, this.y) 
                                < this.detectionRadius) {
            console.warn("Player detected by radius");
            game.prompt.text = "the alien got attracted";
            this.isTrailing = true;
        }
    }

    updateDirection() {
        if (this.x > this.lastPositionX && 
            Math.abs(this.x - this.lastPositionX) > 
            Math.abs(this.y - this.lastPositionY)) {
            this.facing = "right";
            this.cone.angle = 45;
            this.anims.play('alienSideWalking', true);
            this.flipX = false;
            //Math.abs(this.y - this.lastPositionY);
        } else if (this.x < this.lastPositionX && 
            Math.abs(this.x - this.lastPositionX) > 
            Math.abs(this.y - this.lastPositionY)) {
            this.facing = "left";
            this.cone.angle = -135;
            this.anims.play('alienSideWalking', true);
            this.flipX = true;
        } else if (this.y < this.lastPositionY) {
            this.facing = "up";
            this.cone.angle = -45;
            this.anims.play('alienBackWalking', true);
        } else if (this.y > this.lastPositionY) {
            this.facing = "down";
            this.cone.angle = 135;
            this.anims.play('alienFrontWalking', true);
        }
        this.lastPositionX = this.x;
        this.lastPositionY = this.y;
    }

    getDestination() {
        return this.path.polygon[this.movementStep];
    }
    
}
function CreateEnemy(path, scene){
    let enemy = new Enemy(scene, path.x + path.polygon[0].x,
        path.y + path.polygon[0].y, 'enemy');
    scene.add.existing(enemy);
    scene.physics.add.existing(enemy);
    enemy.depth = 10;
    enemy.path = path;
    enemy.cone = new Cone(enemy.detectionDistance, scene, enemy.x,
        enemy.y, 'sector');
    enemy.cone.depth = 2;
    enemy.colCone = new Cone(enemy.detectionDistance, scene, enemy.x,
        enemy.y, 'sector');
    scene.add.existing(enemy.cone);
    scene.physics.add.existing(enemy.cone);
    scene.add.existing(enemy.colCone);
    scene.physics.add.existing(enemy.colCone);
    enemy.colCone.alpha = 0;

    scene.physics.add.collider(scene.player, enemy, () => {
        scene.paused = true;
        scene.player.sfx.stop();
        scene.scene.restart();
        scene.player.x = scene.spawnXY.x;
        scene.player.y = scene.spawnXY.y;
        });
    scene.physics.add.collider(enemy, scene.obstacles);
    scene.physics.add.overlap(enemy.cone, scene.player);
    scene.physics.add.collider(enemy.colCone, scene.obstacles);
    enemy.body.setSize(16, 8);
    enemy.body.setOffset(8, 22);
    return enemy;
}

