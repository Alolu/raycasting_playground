const zoom = 1;
const playerSize = 1

class Player {
    constructor(pos,dir,fov){
        this.pos = pos || new Vector3()
        this.dir = dir || new Vector3(1,0)
        this.fov = fov || new Vector3(0,0.66)

        this.setControls();
    }

    PRESSED_CONTROLS = {
        REGULAR:[],
        STRAFE:[],
    }

    PLAYER_STATE = playerConstants.IDLE;
    PLAYER_STRAFE_STATE = playerConstants.IDLE;
    oldMovement = new Vector3()
    rotatespeed = 0;

    setControls() {
        addEventListener('keydown',(e)=>{
            if(e.key == 'w' || e.key == 'ArrowUp') this.addControl('REGULAR',controlConstants.FORWARD)
            if(e.key == 's' || e.key == 'ArrowDown') this.addControl('REGULAR',controlConstants.BACK)
            if(e.key == 'd' || e.key == 'ArrowRight') this.addControl('STRAFE',controlConstants.RIGHT)
            if(e.key == 'a' || e.key == 'ArrowLeft') this.addControl('STRAFE',controlConstants.LEFT)
        })

        addEventListener('keyup', (e)=>{
            if(e.key == 'w' || e.key == 'ArrowUp') this.removeControl('REGULAR',controlConstants.FORWARD)
            if(e.key == 's' || e.key == 'ArrowDown') this.removeControl('REGULAR',controlConstants.BACK)
            if(e.key == 'd' || e.key == 'ArrowRight') this.removeControl('STRAFE',controlConstants.RIGHT)
            if(e.key == 'a' || e.key == 'ArrowLeft') this.removeControl('STRAFE',controlConstants.LEFT)
        })

        addEventListener('mousemove', (e)=> {
            if(!pointerEnabled) return;
            
            this.rotatespeed = e.movementX * framespeed * 10;

            this.dir.rotate(this.rotatespeed);
            this.fov.rotate(this.rotatespeed);

            this.oldMovement.x = e.movementX
            this.oldMovement.y = e.movementY
        })
    }

    update(){
        let dir = this.dir.multiplyNew(movespeed);
        let strafedir = this.dir.multiplyNew(movespeed / 2).rotate(-90);

        this.updatePlayerState()

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

        //debug('delta',this.rotatespeed)
    }

    updatePlayerState(){
        switch (this.PRESSED_CONTROLS.REGULAR.at(-1)) {
            case controlConstants.FORWARD:
                this.PLAYER_STATE = playerConstants.FORWARD
                break;

            case controlConstants.BACK:
                this.PLAYER_STATE = playerConstants.BACK
                break;

            default:
                this.PLAYER_STATE = playerConstants.IDLE
                break;
        }

        switch (this.PRESSED_CONTROLS.STRAFE.at(-1)) {
            case controlConstants.RIGHT:
                this.PLAYER_STRAFE_STATE = playerConstants.RIGHT
                break;

            case controlConstants.LEFT:
                this.PLAYER_STRAFE_STATE = playerConstants.LEFT
                break;

            default:
                this.PLAYER_STRAFE_STATE = playerConstants.IDLE
                break;
        }
    }

    removeControl(type,value){
        var i = this.PRESSED_CONTROLS[type].indexOf(value);
        if (i !== -1) this.PRESSED_CONTROLS[type].splice(i, 1);
    }

    addControl(type,value){
        if(!this.PRESSED_CONTROLS[type].includes(value)) this.PRESSED_CONTROLS[type].push(value)
    }
    
}