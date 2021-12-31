const zoom = 1;
const playerSize = 1

class Player {
    constructor(pos,dir,fov){
        this.pos = pos || new Vector2D()
        this.dir = dir || new Vector2D(1,0)
        this.fov = fov || new Vector2D(0,0.66)

        this.setControls();
    }

    PRESSED_CONTROLS = {
        FORWARD: false,
        BACK: false,
        RIGHT: false,
        LEFT: false,
    }

    PLAYER_STATE = playerConstants.IDLE;
    PLAYER_STRAFE_STATE = playerConstants.STRAFE_IDLE;
    oldMovement = new Vector2D()
    rotatespeed = 0;

    setControls() {
        addEventListener('keydown',(e)=>{
            if(e.key == 'w' || e.key == 'ArrowUp') this.PLAYER_STATE = playerConstants.FORWARD
            if(e.key == 's' || e.key == 'ArrowDown') this.PLAYER_STATE = playerConstants.BACK
            if(e.key == 'd' || e.key == 'ArrowRight') this.PLAYER_STRAFE_STATE = playerConstants.RIGHT
            if(e.key == 'a' || e.key == 'ArrowLeft') this.PLAYER_STRAFE_STATE = playerConstants.LEFT
        })

        addEventListener('keyup', (e)=>{
            if(['w','s','ArrowUp','ArrowDown'].includes(e.key))this.PLAYER_STATE = playerConstants.IDLE;
            if(['a','d','ArrowRight','ArrowLeft'].includes(e.key))this.PLAYER_STRAFE_STATE = playerConstants.STRAFE_IDLE;
        })

        addEventListener('mousemove', (e)=> {
            this.rotatespeed = e.movementX * framespeed;

            this.dir.rotate(this.rotatespeed);
            this.fov.rotate(this.rotatespeed);

            this.oldMovement.x = e.movementX
            this.oldMovement.y = e.movementY
        })
    }

    update(){
        let dir = this.dir.multiplyNew(movespeed);
        let strafedir = this.dir.multiplyNew(movespeed / 2).rotate(30);


        switch (this.PLAYER_STATE) {
            case playerConstants.FORWARD:
                if(gamemap[Math.floor(this.pos.x + dir.x)][Math.floor(this.pos.y)]) dir.x = 0;
                if(gamemap[Math.floor(this.pos.x)][Math.floor(this.pos.y + dir.y)]) dir.y = 0;
                this.pos.add(dir)
                break;

            case playerConstants.BACK:
                if(gamemap[Math.floor(this.pos.x - dir.x)][Math.floor(this.pos.y)]) dir.x = 0;
                if(gamemap[Math.floor(this.pos.x)][Math.floor(this.pos.y - dir.y)]) dir.y = 0;
                this.pos.substract(dir)
                break;
        
            default:
                break;
        }

        switch (this.PLAYER_STRAFE_STATE) {
            case playerConstants.RIGHT:
                if(gamemap[Math.floor(this.pos.x - strafedir.x)][Math.floor(this.pos.y)]) strafedir.x = 0;
                if(gamemap[Math.floor(this.pos.x)][Math.floor(this.pos.y - strafedir.y)]) strafedir.y = 0;
                this.pos.substract(strafedir)
                break;
        
            case playerConstants.LEFT:
                if(gamemap[Math.floor(this.pos.x + strafedir.x)][Math.floor(this.pos.y)]) strafedir.x = 0;
                if(gamemap[Math.floor(this.pos.x)][Math.floor(this.pos.y + strafedir.y)]) strafedir.y = 0;
                this.pos.add(strafedir)
                break;
        
            default:
                break;
        }

        debug('delta',this.rotatespeed)
    }
}