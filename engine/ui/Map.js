class Map {
    constructor(game){
        this.game = game
        this.player = game.player
    }

    MAP_HEIGHT = 150
    MAP_WIDTH = 200
    MAP_POS = new Vector2D(10,SCREEN_HEIGHT - this.MAP_HEIGHT - 10)

    update(){
        ctx.save();
        ctx.translate(this.MAP_POS.x, this.MAP_POS.y)
        ctx.beginPath()
        
        this.drawRect();
        this.drawMap();
        this.drawPlayer();

        ctx.restore();
    }

    drawRect(){
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0, this.MAP_WIDTH, this.MAP_HEIGHT)
    }

    drawMap(){
        let mapWidthLength = gamemap[0].length;
        let mapHeightLength = gamemap.length;

        let rectWidth = this.MAP_WIDTH/mapWidthLength
        let rectHeight = this.MAP_HEIGHT/mapHeightLength

        //height loop
        for(let k = 0; k < mapHeightLength; k++){
            //width loop
            for(let i = 0; i < mapWidthLength; i++){
                if(gamemap[k][i] > 0){
                    ctx.fillStyle = 'blue'
                    ctx.fillRect(rectWidth * i, rectHeight * k,rectWidth, rectHeight);
                }
            }
        }
    }

    drawPlayer() {
        ctx.fillStyle = 'red'
        ctx.arc(this.player.pos.x, this.player.pos.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}