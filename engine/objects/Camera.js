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
    firstIter = true;
    triggerConsole = false;

    xDebug = SCREEN_WIDTH/2;
    xDebugdrawEnd = 0;
    intersectionsDebug = {
        x: [],
        y: [],
    }
    gridDebug = {
        x: [],
        y: [],
    };
    isCount = 0;

    update(){
        for(let x = 0; x < SCREEN_WIDTH; x++){

            let hit = 0;
            
            this.cameraX = 2*x / SCREEN_WIDTH - 1;
            
            this.setRaydir()
            this.setIntPos()
            this.setDeltaDist()

            this.setStepAndInitialSideDist()

            let whileCountX = 0;
            let whileCountY = 0;

            while(hit == 0) {
                if(this.sideDist.x < this.sideDist.y){
                    if(x == this.xDebug) this.intersectionsDebug.x.push(this.sideDist.x)
                    if(debugEnabled){
                        if(!this.gridDebug.x[whileCountX]) this.gridDebug.x[whileCountX] = [new Vector3(x,this.calcDrawEnd(this.sideDist.x))]
                        else this.gridDebug.x[whileCountX][1] = new Vector3(x,this.calcDrawEnd(this.sideDist.x))
                    } 
                    this.sideDist.x += this.deltaDist.x;
                    this.intPos.x += this.step.x;
                    this.side = 0;
                    whileCountX++;
                } else {
                    if(x == this.xDebug) this.intersectionsDebug.y.push(this.sideDist.y)
                    if(debugEnabled){
                        if(!this.gridDebug.y[whileCountY]) this.gridDebug.y[whileCountY] = [new Vector3(x,this.calcDrawEnd(this.sideDist.y))]
                        else this.gridDebug.y[whileCountY][1] = new Vector3(x,this.calcDrawEnd(this.sideDist.y))
                    } 
                    this.sideDist.y += this.deltaDist.y;
                    this.intPos.y += this.step.y;
                    this.side = 1;
                    whileCountY++;
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
            if(x == this.xDebug) this.xDebugdrawEnd = this.drawEnd;

            this.setColor();
            this.drawLine(x);


            /* debug('perpWallDist',this.perpWallDist)
            debug('player pos x',this.player.pos.x)
            debug('player pos y',this.player.pos.y)
            debug('cell pos x', this.intPos.x)
            debug('cell pos y', this.intPos.y) */
        }
        if(debugEnabled){
            this.drawDebugLine();
            this.drawDebugIntersection();
            debug('debug grid len',this.gridDebug.x.length)
            this.drawDebugGrid();
            if(this.firstIter) console.log(this.gridDebug)
            if(this.triggerConsole) console.log(this.gridDebug)
            this.triggerConsole = false;
            this.gridDebug.x = []
            this.gridDebug.y = []
        }
        this.firstIter = false;
        debug('isCount',this.isCount,'red')
        this.isCount = 0;
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
        //if(this.drawStart < 0) this.drawStart = 0;
        this.drawEnd = this.lineHeight / 2 + SCREEN_HEIGHT / 2
        if(this.drawEnd < 0) this.drawEnd = SCREEN_HEIGHT - 1;
        if(this.drawEnd > SCREEN_HEIGHT - 1) this.drawEnd = SCREEN_HEIGHT - 1;
    }

    drawLine(x){
        let step = TEX_HEIGHT / this.lineHeight;
        let texPos = (this.drawStart - SCREEN_HEIGHT / 2 + this.lineHeight / 2) * step;
        this.tex.y = parseInt(texPos) & (TEX_HEIGHT - 1);
        /* debug('tex y',this.tex.y)
        debug('tex pos',parseInt(texPos))
        debug('step', step)
        debug('drawstart',this.drawStart)
        debug('drawend',this.drawEnd)
        debug('lineheight',this.lineHeight) */

        ctx.drawImage(game.textureLoader.textures[this.textureId],this.tex.x,0,1,TEX_HEIGHT,x,this.drawStart,1,this.lineHeight)
    }

    calcDrawEnd(intersec){
        let lh = Math.floor(SCREEN_HEIGHT / intersec)
        let de = lh / 2 + SCREEN_HEIGHT / 2
        return de;
    }

    drawDebugLine(){
        ctx.beginPath();
        ctx.strokeStyle = 'white'
        ctx.moveTo(SCREEN_WIDTH/2,SCREEN_HEIGHT)
        ctx.lineTo(this.xDebug,this.xDebugdrawEnd)
        ctx.stroke();
        ctx.closePath();
    }

    drawDebugIntersection(){
        ctx.beginPath();
        for(let i = 0; i < this.intersectionsDebug.x.length; i++){
            ctx.fillStyle = 'red'
            let lh = Math.floor(SCREEN_HEIGHT / this.intersectionsDebug.x[i])
            let de = lh / 2 + SCREEN_HEIGHT / 2
            ctx.fillRect(this.xDebug - 5,de - 5,10,10)
            debug('de',de)
        }
        for(let i = 0; i < this.intersectionsDebug.y.length; i++){
            ctx.fillStyle = 'green'
            let lh = Math.floor(SCREEN_HEIGHT / this.intersectionsDebug.y[i])
            let de = lh / 2 + SCREEN_HEIGHT / 2
            ctx.fillRect(this.xDebug - 5,de - 5,10,10)
            debug('de',de)
        }
        ctx.closePath();
        this.intersectionsDebug.x = [];
        this.intersectionsDebug.y = [];
    }

    drawDebugGrid(){
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        this.drawDebugGridLine(this.gridDebug.x)
        debug('gdx 1 length',this.gridDebug.x[0].length)

        ctx.strokeStyle = 'green';
        ctx.fillStyle = 'green';
        this.drawDebugGridLine(this.gridDebug.y)

        this.gridDebug.x = [];
        this.gridDebug.y = [];
    }

    drawDebugGridLine(lineArr){
        for(let i = 0; i < lineArr.length; i++){
            this.isCount++
            let a = lineArr[i][0];
            let b = lineArr[i][1];
            if(b){
                write(`${i + 1}: [${a.x},${a.y}] - [${b.x},${b.y}]`,a.x,a.y)
                ctx.beginPath()
                ctx.moveTo(a.x,a.y)
                debug('grid arr',lineArr.length)
                ctx.lineTo(b.x,b.y)
                ctx.stroke()
                ctx.closePath()
                //ctx.fillRect(x - 5,this.gridDebug.x[i] - 5,10,10)
            } else {
                debug('outlier x',a.x)
                debug('outlier y',a.y)
                ctx.fillRect(a.x,a.y,1,1)
            }
        }
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

    setTexCoords(){
        this.tex.x = Math.floor(this.wall.x * TEX_WIDTH)
        if(this.side == 0 && this.rayDir.x > 0) this.tex.x = TEX_WIDTH - this.tex.x - 1;
        if(this.side == 1 && this.rayDir.y < 0) this.tex.x = TEX_WIDTH - this.tex.x - 1;

        /* debug('intrisic wall x', this.wall.x) */
    }

    rayToMap(){
        let mapRay = new Vector3();

        if(this.side == 0) mapRay.set(this.wall.y,this.wall.x)
        else mapRay.set(this.wall.x, this.wall.y)

        game.map.pushRayQueue(mapRay);
    }
}