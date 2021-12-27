const zoom = 50;
const playerSize = 10

class Player {
    constructor(pos,dir,fov){
        this.pos = pos || new Vector2D()
        this.dir = dir || new Vector2D(1,0)
        this.fov = fov || new Vector2D(0,0.66)
    }

    drawView() {

        let a = this.pos

        let b = new Vector2D();
        let c = new Vector2D();
        let d = new Vector2D();

        b.x = a.x + (this.dir.x * zoom);
        b.y = a.y + (this.dir.y * zoom);

        c.x = b.x + (this.fov.x * zoom);
        c.y = b.y + (this.fov.y * zoom);
        
        d.x = b.x - (this.fov.x * zoom);
        d.y = b.y - (this.fov.y * zoom);

        //draw dir
        ctx.beginPath();
        ctx.strokeStyle = 'white'
        ctx.moveTo(a.x,a.y)
        ctx.lineTo(b.x,b.y)
        ctx.stroke();

        //draw dot
        ctx.beginPath();
        ctx.fillStyle = 'green'
        ctx.arc(a.x, a.y, playerSize, 0, Math.PI * 2);
        ctx.fill();

        //draw camera plane right
        ctx.beginPath();
        ctx.strokeStyle = 'red'
        ctx.moveTo(b.x,b.y)
        ctx.lineTo(c.x, c.y)
        ctx.stroke()

        //draw camera plane left
        ctx.beginPath();
        ctx.strokeStyle = 'red'
        ctx.moveTo(b.x,b.y)
        ctx.lineTo(d.x, d.y)
        ctx.stroke()
    }
}