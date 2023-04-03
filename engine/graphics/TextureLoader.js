class TextureLoader {
    constructor(){
        //Im probably doing something dumb right here lol
        this.textures = [];
        this.floorTexture = null;
        this.loaded = false;
        this.loadTextures()
        //this.loadFloorTexture()
    }

    loadTextures(){
        let maxTexture = 0;
        for (let y = 0; y < gamemap.length; y++) {
                for (var x = 0; x < gamemap[y].length; x++) {
                        maxTexture = Math.max(maxTexture, gamemap[y][x]);
                }
        }

        for (let i = 0; i <= maxTexture; i++) {
                var texture = new Image();
                texture.src = TEXTURE_FOLDER + i + '.png';
                this.textures.push(texture)
        }

        this.loaded = true;
    }

    loadFloorTexture(){
        let tmpCanvas = document.createElement('canvas');
        tmpCanvas.height = TEX_HEIGHT;
        tmpCanvas.width = TEX_WIDTH;

        let tpmctx = tmpCanvas.getContext('2d');

        
                
        let texData = [];
        let texture = new Image();
        texture.src = 'textures/hq/0.png';

        texture.onload = () => {
            tpmctx.drawImage(texture, 0, 0);

            for(let iy = 0; iy < TEX_HEIGHT; iy++){
                texData[iy] = []
                for(let ix = 0; ix < TEX_WIDTH; ix++){
                    texData[iy][ix] = tpmctx.getImageData(ix,iy,1,1).data;
                }
            }
            
            this.floorTexture = texData
            this.loaded = true;
        };
    }

    generateTextures(){
        for(let i = 0; i < 8; i++) this.textures[i] = new Array(TEX_WIDTH * TEX_HEIGHT);

        for(let x = 0; x < TEX_WIDTH; x++){
            for(let y = 0; y < TEX_HEIGHT; y++){
                let xorcolor = (x * 256 / TEX_WIDTH) ^ (y * 256 / TEX_HEIGHT);
                let ycolor = y * 256 / TEX_HEIGHT;
                let xycolor = y * 128 / TEX_HEIGHT + x * 128 / TEX_WIDTH;

                this.textures[0][TEX_WIDTH * y + x] = 65536 * 254 * (x != y && x != TEX_WIDTH - y); //flat red texture with black cross
                this.textures[1][TEX_WIDTH * y + x] = xycolor + 256 * xycolor + 65536 * xycolor; //sloped greyscale
                this.textures[2][TEX_WIDTH * y + x] = 256 * xycolor + 65536 * xycolor; //sloped yellow gradient
                this.textures[3][TEX_WIDTH * y + x] = xorcolor + 256 * xorcolor + 65536 * xorcolor; //xor greyscale
                this.textures[4][TEX_WIDTH * y + x] = 256 * xorcolor; //xor green
                this.textures[5][TEX_WIDTH * y + x] = 65536 * 192 * (x % 16 && y % 16); //red bricks
                this.textures[6][TEX_WIDTH * y + x] = 65536 * ycolor; //red gradient
                this.textures[7][TEX_WIDTH * y + x] = 128 + 256 * 128 + 65536 * 128; //flat grey texture
            }
        }
    }
}