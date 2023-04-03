class Map {
    constructor(game){
        this.game = game
        this.player = game.player
    }

    MAP_HEIGHT = SCREEN_HEIGHT //400
    MAP_WIDTH = SCREEN_WIDTH //500
    MAP_SCALE = 1.5
    SCALE_FACTOR = 1.3
    MAP_POS = new Vector3(SCREEN_WIDTH - this.MAP_WIDTH - 10,SCREEN_HEIGHT - this.MAP_HEIGHT - 30)

    MAP_LENGTH_W = gamemap[0].length;
    MAP_LENGTH_H = gamemap.length;

    MAP_UNIT = 100

    W_RATIO = this.MAP_WIDTH/this.MAP_LENGTH_W;
    H_RATIO = this.MAP_HEIGHT/this.MAP_LENGTH_H;

    raysQueue = [];

    viewDist = 20;
    lastX=SCREEN_WIDTH/2;
    lastY=SCREEN_HEIGHT/2;

    updateOld(){
        ctx.save();
        ctx.translate(this.MAP_POS.x, this.MAP_POS.y)
        ctx.beginPath()
        
        this.drawRect();
        this.drawMap();
        //this.drawRays();
        this.drawPlayer();

        ctx.closePath()
        ctx.restore();
    }

    update(){
        ctx.save()
        this.drawRect()
        this.drawMap()
        ctx.restore()
    }

    drawRect(){
        ctx.fillStyle = '#eaeae9'
        ctx.fillRect(0,0, this.MAP_WIDTH, this.MAP_HEIGHT)
    }

    drawMap(){

        ctx.save();
        ctx.beginPath()
        ctx.strokeStyle = 'white'

        //height loop
        for(let k = 0; k < this.MAP_LENGTH_H; k++){
            //width loop
            ctx.moveTo(this.MAP_UNIT * k,0)
            ctx.lineTo(this.MAP_UNIT * k,this.MAP_HEIGHT)

            for(let i = 0; i < this.MAP_LENGTH_W; i++){

                ctx.moveTo(0,this.MAP_UNIT * i)
                ctx.lineTo(this.MAP_WIDTH,this.MAP_UNIT * i)

                /* if(gamemap[k][i] > 0){
                    ctx.fillStyle = '#FF9E13'
                    ctx.fillRect(this.W_RATIO * k, this.H_RATIO * i, this.W_RATIO, this.H_RATIO);
                } else if(includesVector(game.camera.tilesInFOV,new Vector3(k,i))) {
                    ctx.fillStyle = '#32a85a'
                    ctx.fillRect(this.W_RATIO * k, this.H_RATIO * i, this.W_RATIO, this.H_RATIO);
                } */
            }
        }
        ctx.stroke()
        ctx.closePath()
        ctx.restore();
    }

    moveToPlayer(){
        ctx.moveTo(this.player.pos.x * this.W_RATIO, this.player.pos.y * this.H_RATIO);
    }

    drawPlayer() {
        ctx.fillStyle = 'red'
        ctx.arc(this.player.pos.x * this.W_RATIO, this.player.pos.y * this.H_RATIO, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFOV(){
        ctx.strokeStyle = 'purple'
        let dir = this.player.pos.addNew(this.player.dir);
        this.moveToPlayer();
        ctx.lineTo(dir.x * this.W_RATIO,dir.y * this.H_RATIO);
        ctx.stroke();
    }

    drawRays(){
        ctx.save();
        ctx.beginPath()
        let playerPosRatio = this.vectorToRatio(this.player.pos)

        let rayGradient = ctx.createRadialGradient(playerPosRatio.x,playerPosRatio.y,this.viewDist,playerPosRatio.x,playerPosRatio.y, this.viewDist * 5)
        rayGradient.addColorStop(0,'white')
        rayGradient.addColorStop(1,'black')
        
        ctx.strokeStyle = rayGradient
        
        for(let ray of this.raysQueue){
            this.moveToPlayer();
            ctx.lineTo(ray.x * this.W_RATIO, ray.y * this.H_RATIO);
        }
        ctx.stroke();
        ctx.closePath()
        ctx.restore();
        this.raysQueue = [];
    }

    pushRayQueue(pos) {
        this.raysQueue.push(pos)
    }

    vectorToRatio(vec){
        return new Vector3(vec.x * this.W_RATIO, vec.y * this.H_RATIO)
    }
}
