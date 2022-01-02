class FloorCast {

    constructor(game){
        this.player = game.player
    }

    floorStep = new Vector3();
    rayDirA = new Vector3();
    rayDirB = new Vector3();
    floor = new Vector3();
    cell = new Vector3();
    texture = new Vector3();
    

    floorTextureId = 3;
    ceilingTextureId = 6;

    update(){
        for(let y = 0; y < 24; y++){

            let p = y - SCREEN_HEIGHT / 2;
            let rowDistance = this.player.pos.z / p;

            this.rayDirA.x = this.player.dir.x - this.player.fov.x;
            this.rayDirA.y = this.player.dir.y - this.player.fov.y;

            this.rayDirB.x = this.player.dir.x + this.player.fov.x;
            this.rayDirB.y = this.player.dir.y + this.player.fov.y;

            this.floorStep.x = rowDistance * (this.rayDirB.x - this.rayDirA.x) / SCREEN_WIDTH;
            this.floorStep.y = rowDistance * (this.rayDirB.y - this.rayDirA.y) / SCREEN_WIDTH;

            this.floor.x = this.player.pos.x + rowDistance * this.rayDirA.x;
            this.floor.y = this.player.pos.y + rowDistance * this.rayDirA.y;

            this.cell = this.floor.clone().toInt()
        
                // get the texture coordinate from the fractional part
            this.texture.x = Math.floor(TEX_WIDTH * (this.floor.x - this.cell.x)) & (TEX_WIDTH - 1);
            this.texture.y = Math.floor(TEX_HEIGHT * (this.floor.y - this.cell.y)) & (TEX_HEIGHT - 1);

            let texLength = Math.floor(SCREEN_WIDTH/gamemap.length);
            let step = this.floorStep * texLength;

            for(let x = 0; x < gamemap.length; x++){
                ctx.drawImage(game.textureLoader.textures[this.floorTextureId],this.texture.x,this.texture.y,TEX_WIDTH,1,this.floor.x * step,y,TEX_WIDTH,1)
            }

            if(y >= SCREEN_HEIGHT-1) {
                debug('p',p)
                debug('rowdist',rowDistance)
            }


            //ctx.drawImage(game.textureLoader.textures[this.floorTextureId],this.texture.x,this.texture.y,TEX_WIDTH,1,this.cell.x * tile * TEX_WIDTH,y,TEX_WIDTH,1)

            debug('floor x',this.floor.x)
            debug('floor y',this.floor.y)

            debug('floorstep x',this.floorStep.x * TEX_WIDTH)
            debug('floorstep y',this.floorStep.y * TEX_HEIGHT)

            debug('floortex x',this.texture.x)
            debug('floortex y',this.texture.y)

            


            /* for(let x = 0; x < SCREEN_WIDTH; x++){
                // the cell coord is simply got from the integer parts of floorX and floorY
                int cellX = (int)(floorX);
                int cellY = (int)(floorY);

                // get the texture coordinate from the fractional part
                int tx = (int)(texWidth * (floorX - cellX)) & (texWidth - 1);
                int ty = (int)(texHeight * (floorY - cellY)) & (texHeight - 1);

                floorX += floorStepX;
                floorY += floorStepY;

                // choose texture and draw the pixel
                int floorTexture = 3;
                int ceilingTexture = 6;
                Uint32 color;

                // floor
                color = texture[floorTexture][texWidth * ty + tx];
                color = (color >> 1) & 8355711; // make a bit darker
                buffer[y][x] = color;

                //ceiling (symmetrical, at screenHeight - y - 1 instead of y)
                color = texture[ceilingTexture][texWidth * ty + tx];
                color = (color >> 1) & 8355711; // make a bit darker
                buffer[screenHeight - y - 1][x] = color;
            } */
        }
    }
}