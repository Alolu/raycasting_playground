class Game {
    player = new Player(new Vector2D(5,5));
    map = new Map(this);

    update() {
        for(let x = 0; x < SCREEN_WIDTH; x++){
            
            let cameraX = 2*x / SCREEN_WIDTH - 1;
            let perpWallDist;
            let hit = 0;
            let side;
            let lineHeight;
            let drawStart,drawEnd;
            let sideDist = {
                x: null,
                y: null,
            }
            let step = {
                x: null,
                y: null,
            }
            let rayDir = {
                x: this.player.dir.x + this.player.fov.x * cameraX,
                y: this.player.dir.y + this.player.fov.y * cameraX,
            }
            let map = {
                x: Math.floor(this.player.pos.x),
                y: Math.floor(this.player.pos.y),
            }
            let deltaDist = {
                x: Math.abs(1/rayDir.x),
                y: Math.abs(1/rayDir.y),
            }

            if(rayDir.x < 0) {
                step.x = -1;
                sideDist.x = (this.player.pos.x - map.x) * deltaDist.x
            } else {
                step.x = 1;
                sideDist.x = (map.x + 1 - this.player.pos.x) * deltaDist.x
            }
            if(rayDir.y < 0) {
                step.y = -1;
                sideDist.y = (this.player.pos.y - map.y) * deltaDist.y
            } else {
                step.y = 1;
                sideDist.y = (map.y + 1 - this.player.pos.y) * deltaDist.y
            }
            
            while(hit == 0) {
                if(sideDist.x < sideDist.y){
                    sideDist.x += deltaDist.x;
                    map.x += step.x;
                    side = 0;
                } else {
                    sideDist.y += deltaDist.y;
                    map.y += step.y;
                    side = 1;
                }

                if(gamemap[map.x][map.y] > 0) hit = 1;

                /* write(`hit: ${hit}`,10,30)
                write(`map coords: ${map.x},${map.y}`,10,60)
                write(`map val: ${gamemap[map.x][map.y]}`,10,90)
                write(`map step: ${step.x},${step.y}`,10,120)
                write(`player pos: ${this.player.pos.x},${this.player.pos.y}`,10,150) */
            }

            //get closest distance from visible wall to camera plane (explication to revisit)
            perpWallDist = side ? (sideDist.y - deltaDist.y) : (sideDist.x - deltaDist.x);

            lineHeight = Math.floor(SCREEN_HEIGHT / perpWallDist)
            drawStart = -lineHeight / 2 + SCREEN_HEIGHT / 2
            if(drawStart < 0) drawStart = 0;
            drawEnd = lineHeight / 2 + SCREEN_HEIGHT / 2
            if(drawEnd < 0) drawEnd = SCREEN_HEIGHT - 1;

            ctx.beginPath()
            ctx.strokeStyle = 'red'
            ctx.moveTo(x,drawStart);
            ctx.lineTo(x,drawEnd);
            ctx.stroke();
        }

        this.map.update();
    }

    calculateSideDist(rayDir,step,sideDist,deltaDist,map) {
        
    }
}
