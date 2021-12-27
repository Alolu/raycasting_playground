class Map {
    constructor(game){
        this.game = game
        this.player = game.player
    }

    MAP_HEIGHT = 150
    MAP_WIDTH = 200
    MAP_POS = new Vector2D(10,SCREEN_HEIGHT - this.MAP_HEIGHT - 10)

    MAP_LENGTH_W = gamemap[0].length;
    MAP_LENGTH_H = gamemap.length;

    W_RATIO = this.MAP_WIDTH/this.MAP_LENGTH_W;
    H_RATIO = this.MAP_HEIGHT/this.MAP_LENGTH_H;

    update(){
        ctx.save();
        ctx.translate(this.MAP_POS.x, this.MAP_POS.y)
        ctx.beginPath()
        
        this.drawRect();
        this.drawMap();
        this.drawPlayer();
        this.drawFOV();

        ctx.restore();
    }

    drawRect(){
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0, this.MAP_WIDTH, this.MAP_HEIGHT)
    }

    drawMap(){

        //height loop
        for(let k = 0; k < this.MAP_LENGTH_H; k++){
            //width loop
            for(let i = 0; i < this.MAP_LENGTH_W; i++){
                if(gamemap[k][i] > 0){
                    ctx.fillStyle = 'blue'
                    ctx.fillRect(this.W_RATIO * i, this.H_RATIO * k, this.W_RATIO, this.H_RATIO);
                }
            }
        }
    }

    drawPlayer() {
        ctx.fillStyle = 'red'
        ctx.arc(this.player.pos.x * this.W_RATIO, this.player.pos.y * this.H_RATIO, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFOV(){
        ctx.strokeStyle = 'purple'
        let dir = this.player.pos.addNew(this.player.dir);
        ctx.moveTo(this.player.pos.x * this.W_RATIO, this.player.pos.y * this.H_RATIO);
        ctx.lineTo(dir.x * this.W_RATIO,dir.y * this.H_RATIO);
        ctx.stroke();
    }
}