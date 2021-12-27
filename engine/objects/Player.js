const zoom = 1;
const playerSize = 1

class Player {
    constructor(pos,dir,fov){
        this.pos = pos || new Vector2D()
        this.dir = dir || new Vector2D(1,0)
        this.fov = fov || new Vector2D(0,0.66)

        this.setControls();
    }

    drawView() {

        let a = this.pos
        let b = a.addNew(this.dir);
        let c = b.addNew(this.fov);
        let d = b.substractNew(this.fov);

        //draw dir
        ctx.beginPath();
        ctx.strokeStyle = 'white'
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke();

        //draw dot
        ctx.beginPath();
        ctx.fillStyle = 'green'
        ctx.arc(a.x, a.y, playerSize, 0, Math.PI * 2);
        ctx.fill();

        //draw camera plane right
        ctx.beginPath();
        ctx.strokeStyle = 'red'
        ctx.moveTo(b.x, b.y)
        ctx.lineTo(c.x, c.y)
        ctx.stroke()

        //draw camera plane left
        ctx.beginPath();
        ctx.strokeStyle = 'red'
        ctx.moveTo(b.x, b.y)
        ctx.lineTo(d.x, d.y)
        ctx.stroke()
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