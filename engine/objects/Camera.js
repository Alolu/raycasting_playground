class Camera {
    constructor(game,pos){
        this.game = game;
        this.player = this.game.player;
        this.pos = pos || Vector2D();
    }

    perpWallDist;
    cameraX = 0;
    side = 0;
    lineHeight;
    drawStart;
    drawEnd;
    sideDist = new Vector2D();
    step = new Vector2D();
    rayDir = new Vector2D();
    intPos = new Vector2D();
    deltaDist = new Vector2D();

    update(){
        for(let x = 0; x < SCREEN_WIDTH; x++){

            let hit = 0;
            
            this.cameraX = 2*x / SCREEN_WIDTH - 1;
            
            this.setRaydir()
            this.setIntPos()
            this.setDeltaDist()

            this.setStepAndInitialSideDist()
            
            while(hit == 0) {
                if(this.sideDist.x < this.sideDist.y){
                    this.sideDist.x += this.deltaDist.x;
                    this.intPos.x += this.step.x;
                    this.side = 0;
                } else {
                    this.sideDist.y += this.deltaDist.y;
                    this.intPos.y += this.step.y;
                    this.side = 1;
                }

                //If the ray hit into a wall, stop the ray
                if(gamemap[this.intPos.x][this.intPos.y] > 0) hit = 1;
            }

            game.map.pushRayQueue(this.intPos);

            //get closest distance from visible wall to camera plane (explication to revisit)
            this.perpWallDist = this.side ? (this.sideDist.y - this.deltaDist.y) : (this.sideDist.x - this.deltaDist.x);

            this.lineHeight = Math.floor(SCREEN_HEIGHT / this.perpWallDist)
            
            this.setDrawBoundary();
            this.drawLine(x);
        }
    }

    setRaydir(){
        this.rayDir.x = this.player.dir.x + this.player.fov.x * this.cameraX;
        this.rayDir.y = this.player.dir.y + this.player.fov.y * this.cameraX;
    }

    setIntPos(){
        this.intPos.x = Math.floor(this.player.pos.x);
        this.intPos.y = Math.floor(this.player.pos.y);
    }

    setDeltaDist(){
        this.deltaDist.x = Math.abs(1/this.rayDir.x);
        this.deltaDist.y = Math.abs(1/this.rayDir.y)
    }

    setStepAndInitialSideDist(){
        if(this.rayDir.x < 0) {
            this.step.x = -1;
            this.sideDist.x = (this.player.pos.x - this.intPos.x) * this.deltaDist.x
        } else {
            this.step.x = 1;
            this.sideDist.x = (this.intPos.x + 1 - this.player.pos.x) * this.deltaDist.x
        }

        if(this.rayDir.y < 0) {
            this.step.y = -1;
            this.sideDist.y = (this.player.pos.y - this.intPos.y) * this.deltaDist.y
        } else {
            this.step.y = 1;
            this.sideDist.y = (this.intPos.y + 1 - this.player.pos.y) * this.deltaDist.y
        }
    }

    setDrawBoundary(){
        this.drawStart = -this.lineHeight / 2 + SCREEN_HEIGHT / 2
        if(this.drawStart < 0) this.drawStart = 0;
        this.drawEnd = this.lineHeight / 2 + SCREEN_HEIGHT / 2
        if(this.drawEnd < 0) this.drawEnd = SCREEN_HEIGHT - 1;
    }

    drawLine(x){
        ctx.beginPath()
        ctx.strokeStyle = 'red'
        ctx.moveTo(x, this.drawStart);
        ctx.lineTo(x, this.drawEnd);
        ctx.stroke();
    }
}