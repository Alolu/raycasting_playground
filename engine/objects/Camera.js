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
    textureId;
    drawEnd;
    color;
    sideDist = new Vector2D();
    step = new Vector2D();
    rayDir = new Vector2D();
    intPos = new Vector2D();
    deltaDist = new Vector2D();
    wall = new Vector2D();
    tex = new Vector2D();
    buffer = [];

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

            //get closest distance from visible wall to camera plane (explication to revisit)
            this.perpWallDist = this.side ? (this.sideDist.y - this.deltaDist.y) : (this.sideDist.x - this.deltaDist.x);
            this.lineHeight = Math.floor(SCREEN_HEIGHT / this.perpWallDist)
            this.textureId = gamemap[this.intPos.x][this.intPos.y] - 1;

            //Object needs to be cloned as to not pass intPos reference
            this.setWallCoords();
            this.rayToMap();

            //Substract the integer to get the wall coordinate itself
            this.wall.x -= Math.floor(this.wall.x);

            this.setTexCoords();
            this.setDrawBoundary();
            //this.drawTexture(x);

            this.setColor();
            this.drawLine(x);

            debug('perpWallDist',this.perpWallDist)
            debug('player pos x',this.player.pos.x)
            debug('player pos y',this.player.pos.y)
            debug('cell pos x', this.intPos.x)
            debug('cell pos y', this.intPos.y)
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

    setColor(){
        if(this.side){
            this.color = '#FF4300'
        } else {
            this.color = '#CC3500'
        }

    }

    setDrawBoundary(){
        this.drawStart = -this.lineHeight / 2 + SCREEN_HEIGHT / 2
        if(this.drawStart < 0) this.drawStart = 0;
        this.drawEnd = this.lineHeight / 2 + SCREEN_HEIGHT / 2
        if(this.drawEnd < 0) this.drawEnd = SCREEN_HEIGHT - 1;
        if(this.drawEnd > SCREEN_HEIGHT - 1) this.drawEnd = SCREEN_HEIGHT - 1;
    }

    drawLine(x){
        let step = TEX_HEIGHT / this.lineHeight;
        let texPos = (this.drawStart - SCREEN_HEIGHT / 2 + this.lineHeight / 2) * step;
        this.tex.y = parseInt(texPos) & (TEX_HEIGHT - 1);
        debug('tex y',this.tex.y)
        debug('tex pos',parseInt(texPos))
        debug('step', step)
        debug('drawstart',this.drawStart)
        debug('drawend',this.drawEnd)
        debug('lineheight',this.lineHeight)
        ctx.drawImage(game.textureLoader.textures[this.textureId],this.tex.x,this.tex.y,1,TEX_HEIGHT,x,Math.floor(this.drawStart),1,this.lineHeight)
    }

    setWallCoords(){
        if (this.side == 0) {
            this.wall.x = this.player.pos.y + this.perpWallDist * this.rayDir.y;
            this.wall.y = this.player.pos.x + this.perpWallDist * this.rayDir.x;
            //this.wall.y = this.player.pos.x + this.perpWallDist * this.rayDir.x;
        } else {
            this.wall.x = this.player.pos.x + this.perpWallDist * this.rayDir.x;
            this.wall.y = this.player.pos.y + this.perpWallDist * this.rayDir.y;
        }
        //this.wall.x -= Math.floor(this.wall.x);
        debug('wallX',this.wall.x)
        debug('wallY',this.wall.y)
    }

    setTexCoords(){
        this.tex.x = Math.floor(this.wall.x * TEX_WIDTH)
        if(this.side == 0 && this.rayDir.x > 0) this.tex.x = TEX_WIDTH - this.tex.x - 1;
        if(this.side == 1 && this.rayDir.y < 0) this.tex.x = TEX_WIDTH - this.tex.x - 1;

        debug('intrisic wall x', this.wall.x)
    }

    rayToMap(){
        let mapRay = new Vector2D();

        if(this.side == 0) mapRay.set(this.wall.y,this.wall.x)
        else mapRay.set(this.wall.x, this.wall.y)

        game.map.pushRayQueue(mapRay);
    }
}