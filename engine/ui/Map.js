class Map {
    constructor(game){
        this.game = game
        this.player = game.player
    }

    MAP_HEIGHT = 150
    MAP_WIDTH = 200
    MAP_POS = new Vector3(10,SCREEN_HEIGHT - this.MAP_HEIGHT - 10)

    MAP_LENGTH_W = gamemap[0].length;
    MAP_LENGTH_H = gamemap.length;

    W_RATIO = this.MAP_WIDTH/this.MAP_LENGTH_W;
    H_RATIO = this.MAP_HEIGHT/this.MAP_LENGTH_H;

    raysQueue = [];

    viewDist = 20;

    update(){
        ctx.save();
        ctx.translate(this.MAP_POS.x, this.MAP_POS.y)
        ctx.beginPath()
        
        this.drawRect();
        this.drawMap();
        this.drawPlayer();
        this.drawRays();

        ctx.restore();
    }

    drawRect(){
        ctx.fillStyle = 'black'
        ctx.fillRect(0,0, this.MAP_WIDTH, this.MAP_HEIGHT)
    }

    drawMap(){

        //height loop
        for(let k = 0; k < this.MAP_LENGTH_H; k++){
            //width loop
            for(let i = 0; i < this.MAP_LENGTH_W; i++){
                if(gamemap[k][i] > 0){
                    ctx.fillStyle = '#FF9E13'
                    ctx.fillRect(this.W_RATIO * k, this.H_RATIO * i, this.W_RATIO, this.H_RATIO);
                }
            }
        }
    }

    moveToPlayer(){
        ctx.moveTo(this.player.pos.x * this.W_RATIO, this.player.pos.y * this.H_RATIO);
    }

    drawPlayer() {
        ctx.fillStyle = 'red'
        ctx.arc(this.player.pos.x * this.W_RATIO, this.player.pos.y * this.H_RATIO, 1, 0, Math.PI * 2);
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
        this.raysQueue = [];
    }

    pushRayQueue(pos) {
        this.raysQueue.push(pos)
    }

    vectorToRatio(vec){
        return new Vector3(vec.x * this.W_RATIO, vec.y * this.H_RATIO)
    }
}