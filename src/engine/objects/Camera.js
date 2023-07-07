class Camera {
    constructor(game,pos){
        this.game = game;
        this.player = this.game.player;
        this.pos = pos || new Vector3();

        addEventListener('keypress',(e)=>{
            if(e.key == 'r'){
                this.triggerConsole = true;
            }
        })
    }

    perpWallDist;
    cameraX = 0;
    side = 0;
    render = true;
    lineHeight;
    drawStart;
    textureId;
    drawEnd;
    color;
    sideDist = new Vector3();
    step = new Vector3();
    rayDir = new Vector3();
    intPos = new Vector3();
    deltaDist = new Vector3();
    wall = new Vector3();
    tex = new Vector3();
    buffer = [];
    triggerConsole = false;
    tilesInFOV = [];
    
    xDebug = SCREEN_WIDTH/2;
    xDebugdrawEnd = 0;
    gridDebug = {
        x: [],
        y: [],
        test: [],
    };
    isCount = 0;

    update(){

        this.tilesInFOV = [];

        for(let x = 0; x < SCREEN_WIDTH; x++){
            
            this.cameraX = 2*x / SCREEN_WIDTH - 1;
            //cameraX acts as the cosine of the screen, which is used to set the ray direction
            //it also serves to split the plane (fov) in half which is useful for pytaghorean calc
            let intersectionArr = [];
            
            //set ray direction
            this.rayDir.x = this.player.dir.x + this.player.fov.x * this.cameraX;
            this.rayDir.y = this.player.dir.y + this.player.fov.y * this.cameraX;
            //this.cameraX
            
            //set integer player position in map
            this.intPos.x = Math.floor(this.player.pos.x);
            this.intPos.y = Math.floor(this.player.pos.y);
            
            //set delta dist
            this.deltaDist.x = Math.abs(1/this.rayDir.x);
            this.deltaDist.y = Math.abs(1/this.rayDir.y)

            this.setStepAndInitialSideDist()
            //debug('initial sidedist',this.sideDist.toString())

            if(x == 0) this.tilesInFOV.push(this.intPos.clone())
            let tilesFOVx = []

            let hit = 0;
            while(hit == 0) {
                if(this.sideDist.x < this.sideDist.y){
                    this.sideDist.x += this.deltaDist.x;
                    this.intPos.x += this.step.x;
                    this.side = 0;
                    if(x == this.xDebug) {
                        let vec = new Vector3(x,this.calcDrawEnd(this.sideDist.x - this.deltaDist.x))
                        vec.color = 'red'
                        vec.sideDist = this.sideDist;
                        vec.deltaDist = this.deltaDist;
                        vec.intPos = this.intPos.clone();
                        intersectionArr.push(vec)
                    }
                } else {
                    this.sideDist.y += this.deltaDist.y;
                    this.intPos.y += this.step.y;
                    this.side = 1;
                    if(x == this.xDebug) {
                        let vec = new Vector3(x,this.calcDrawEnd(this.sideDist.y - this.deltaDist.y))
                        vec.color = 'blue'
                        vec.sideDist = this.sideDist.clone();
                        vec.deltaDist = this.deltaDist.clone();
                        vec.intPos = this.intPos.clone();
                        intersectionArr.push(vec)
                    } 
                }

                //If the ray hit into a wall, stop the ray
                if(gamemap[this.intPos.x][this.intPos.y] > 0) hit = 1;
                //else if(!includesVector(this.tilesInFOV,this.intPos)) this.tilesInFOV.push(this.intPos.clone())
            }
            //get closest distance from visible wall to camera plane (explication to revisit)
            this.perpWallDist = this.side ? (this.sideDist.y - this.deltaDist.y) : (this.sideDist.x - this.deltaDist.x);
            debug('ppwd',this.perpWallDist)
            this.lineHeight = Math.floor(SCREEN_HEIGHT / this.perpWallDist)
            this.textureId = gamemap[this.intPos.x][this.intPos.y] - 1;

            //Object needs to be cloned as to not pass intPos reference
            this.setWallCoords();
            this.rayToMap();

            //Substract the integer to get the wall coordinate itself
            this.wall.x -= Math.floor(this.wall.x);

            this.tex.x = Math.floor(this.wall.x * TEX_WIDTH)
            this.tex.x = TEX_WIDTH - this.tex.x - 1;

            this.setDrawBoundary();

            //if(this.xDebug == x) this.drawDebugLine();
            this.drawLine(x);
            //this.drawDebugCoords(intersectionArr);
        }
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
        //if(this.drawStart < 0) this.drawStart = 0;
        this.drawEnd = this.lineHeight / 2 + SCREEN_HEIGHT / 2
        if(this.drawEnd < 0) this.drawEnd = SCREEN_HEIGHT - 1;
        if(this.drawEnd > SCREEN_HEIGHT - 1) this.drawEnd = SCREEN_HEIGHT - 1;
    }

    drawLine(x){
        if(!this.render) return;
        //let step = TEX_HEIGHT / this.lineHeight;
        //let texPos = (this.drawStart - SCREEN_HEIGHT / 2 + this.lineHeight / 2) * step;
        //this.tex.y = parseInt(texPos) & (TEX_HEIGHT - 1);

        ctx.drawImage(game.textureLoader.textures[this.textureId],this.tex.x,0,1,TEX_HEIGHT,x,this.drawStart,1,this.lineHeight)
    }

    calcDrawEnd(intersec){
        let lh = Math.floor(SCREEN_HEIGHT / intersec)
        let de = lh / 2 + SCREEN_HEIGHT / 2
        return de;

        //reverse calc draw end: 969/((test - 969/2)*2)
    }

    drawDebugLine(){
        ctx.beginPath();
        ctx.strokeStyle = 'white'
        ctx.moveTo(SCREEN_WIDTH/2,SCREEN_HEIGHT)
        ctx.lineTo(this.xDebug,this.drawStart + this.lineHeight)
        ctx.stroke();
        ctx.closePath();
    }

    drawDebugCoords(vecArr){
        ctx.beginPath();
        for(let [i,vec] of vecArr.entries()){
            ctx.fillStyle = vec.color
            ctx.fillRect(vec.x - 5,vec.y - 5, 10, 10)
            let limit = 4
            if(i < limit){
                write(`pos       [${vec.toString()}]`,vec.x + 5, vec.y + 5,'white',15)
                write(`map pos   [${vec.intPos.toString()}]`,vec.x + 5, vec.y + 20,'white',10)
                write(`sidedist  [${vec.sideDist.toString()}]`,vec.x + 5, vec.y + 35,'white',10)
                write(`deltadist [${vec.deltaDist.toString()}]`,vec.x + 5, vec.y + 50,'white',10)
                write(`subdist   [${vec.sideDist.substract(vec.deltaDist).toString()}]`,vec.x + 5, vec.y + 65,'white',10)
            }
        }
        ctx.closePath();
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
        /* debug('wallX',this.wall.x)
        debug('wallY',this.wall.y) */
    }

    rayToMap(){
        let mapRay = new Vector3();

        if(this.side == 0) mapRay.set(this.wall.y,this.wall.x)
        else mapRay.set(this.wall.x, this.wall.y)

        //game.map.pushRayQueue(mapRay);
    }
}