const zoom = 1;
const playerSize = 1

class Player {
    constructor(pos,dir,fov){
        this.pos = pos || new Vector2D()
        this.dir = dir || new Vector2D(1,0)
        this.fov = fov || new Vector2D(0,0.66)

        this.setControls();
    }

    setControls() {
        addEventListener('keydown',(e)=>{
            if(e.key == 'w' || e.key == 'ArrowUp'){
                this.pos.add(this.dir.multiplyNew(movespeed))
            }
            if(e.key == 's' || e.key == 'ArrowDown'){
                this.pos.substract(this.dir.multiplyNew(movespeed))
            }
            if(e.key == 'd' || e.key == 'ArrowRight'){
                this.dir.rotate(rotatespeed);
                this.fov.rotate(rotatespeed);
            }
            if(e.key == 'a' || e.key == 'ArrowLeft'){
                this.dir.rotate(-rotatespeed);
                this.fov.rotate(-rotatespeed);
            }
        })
    }
}