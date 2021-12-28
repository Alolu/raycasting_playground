const zoom = 1;
const playerSize = 1

class Player {
    constructor(pos,dir,fov){
        this.pos = pos || new Vector2D()
        this.dir = dir || new Vector2D(1,0)
        this.fov = fov || new Vector2D(0,0.66)

        this.setControls();
    }

    PLAYER_STATE = playerConstants.IDLE;

    setControls() {
        addEventListener('keydown',(e)=>{
            if(e.key == 'w' || e.key == 'ArrowUp') this.PLAYER_STATE = playerConstants.FORWARD
            if(e.key == 's' || e.key == 'ArrowDown') this.PLAYER_STATE = playerConstants.BACK
            if(e.key == 'd' || e.key == 'ArrowRight') this.PLAYER_STATE = playerConstants.RIGHT
            if(e.key == 'a' || e.key == 'ArrowLeft') this.PLAYER_STATE = playerConstants.LEFT
        })

        addEventListener('keyup', (e)=>{
            this.PLAYER_STATE = playerConstants.IDLE;
        })
    }

    update(){
        switch (this.PLAYER_STATE) {
            case playerConstants.FORWARD:
                this.pos.add(this.dir.multiplyNew(movespeed))
                break;

            case playerConstants.BACK:
                this.pos.substract(this.dir.multiplyNew(movespeed))
                break;
            
            case playerConstants.RIGHT:
                this.dir.rotate(rotatespeed);
                this.fov.rotate(rotatespeed);
                break;
        
            case playerConstants.LEFT:
                this.dir.rotate(-rotatespeed);
                this.fov.rotate(-rotatespeed);
                break;
        
            default:
                break;
        }
    }
}