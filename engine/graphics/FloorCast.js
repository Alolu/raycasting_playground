class FloorCast {

    constructor(game) {
        this.player = game.player
        this.buffer = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT)
    }

    floorStep = new Vector3();
    rayDirA = new Vector3();
    rayDirB = new Vector3();
    floor = new Vector3();
    cell = new Vector3();
    texture = new Vector3();

    floorTextureId = 3;
    ceilingTextureId = 6;

    setBufferData(imageData,x,y,pixel){
        let idx = 4 * (x + y * SCREEN_WIDTH);

        imageData.data[idx] = pixel[0]
        imageData.data[idx + 1] = pixel[1]
        imageData.data[idx + 2] = pixel[2]
        imageData.data[idx + 3] = pixel[3]
    }

    update() {
        for (let y = 0; y < SCREEN_HEIGHT; y++) {

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

            /* for(let tile = 0; tile < gamemap.length; tile++){
                ctx.save()
                ctx.setTransform(1,0,0,0.5,0,TEX_HEIGHT)
                ctx.drawImage(game.textureLoader.textures[this.floorTextureId],TEX_HEIGHT * y,SCREEN_HEIGHT-TEX_HEIGHT)
                ctx.restore()
            } */

            for (let x = 0; x < SCREEN_WIDTH; x++) {

                this.cell = this.floor.clone().toInt();

                // get the texture coordinate from the fractional part
                this.texture.x = Math.floor(TEX_WIDTH * (this.floor.x - this.cell.x)) & (TEX_WIDTH - 1);
                this.texture.y = Math.floor(TEX_HEIGHT * (this.floor.y - this.cell.y)) & (TEX_HEIGHT - 1);

                this.floor.add(this.floorStep);

                // floor
                let pixel = game.textureLoader.floorTexture[this.texture.y][this.texture.x];
                //pixel = (color >> 1) & 8355711; // make a bit darker
                this.setBufferData(this.buffer,x,y,pixel)

                //ceiling (symmetrical, at screenHeight - y - 1 instead of y)
                //pixel = texture[ceilingTexture][texWidth * ty + tx];
                //color = (color >> 1) & 8355711; // make a bit darker
                this.setBufferData(this.buffer,x,SCREEN_HEIGHT - y - 1,pixel)
            }
        }
        ctx.beginPath()
        ctx.putImageData(this.buffer,0,0)
        ctx.closePath()
    }
}