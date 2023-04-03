class DebugHandler {
    constructor(game,enabled){
        this.game = game;
        this.allEnabled = enabled || false;

        addEventListener('keypress',this.debugEventHandler.bind(this))
    }

    showConsoleEnabled = false;
    iteration = 0;
    grid = {
        x: [],
        y: [],
    };

    update(){
        if(this.allEnabled) {
            this.drawGrid();
        }
        if(this.showConsoleEnabled) this.consoleAllVars()
        this.resetVars();
    }

    /* pushGridCoords(x,y,xpos,ypos){
        let coordVec = new Vector3(x,y);

        if(!this.grid.x[xpos]) {
            this.grid.x[xpos] = []
            this.grid.x[xpos][ypos] = new Cell(coordVec,coordVec,coordVec,coordVec) //[coordVec]
            return;
        }
        if(!this.grid.x[xpos][ypos]) {
            this.grid.x[xpos][ypos] = new Cell(coordVec,coordVec,coordVec,coordVec)
            return;
        }

        let cell = this.grid.x[xpos][ypos];

        if(x > cell.tr.x) cell.tr = coordVec;
        if(y < cell.bl.y && x < cell.bl.x) cell.bl = coordVec;
        if(y < cell.tl.y && x >= cell.tl.x) cell.tl = coordVec;
        cell.br = coordVec;
    } */

    pushGridCoords(x,y,xpos,ypos){
        let coordVec = new Vector3(x,y);
        if(!this.grid.x[xpos]) this.grid.x[xpos] = []
        if(!this.grid.x[xpos][ypos]) this.grid.x[xpos][ypos] = new Cell(coordVec,coordVec,coordVec,coordVec)
        let cell = this.grid.x[xpos][ypos];
        //cell.br = coordVec;

        if(x > cell.tr.x) cell.tr = coordVec;
        if(y >= cell.bl.y) cell.bl = coordVec;
        if(y < cell.tl.y && x > cell.tl.x) cell.tl = coordVec;

        if(this.grid.x[xpos][ypos + 1]){
            let cellY1 = this.grid.x[xpos][ypos + 1];
            cellY1.br = cell.bl;
        }
    }

    drawGrid(){
        this.grid.x = this.grid.x.filter(e=>e);

        for(let i = 0; i < this.grid.x.length; i++){
            this.grid.x[i] = this.grid.x[i].filter(e=>e);
            for(let j = 0; j < this.grid.x[i].length; j++){
                let cell = this.grid.x[0][0]
                write(`[${cell.tr.x},${cell.tr.y}]`,cell.tr.x,cell.tr.y - 5,'white','20px');
                write(`[${cell.tl.x},${cell.tl.y}]`,cell.tl.x,cell.tl.y - 5,'white','20px');
                write(`[${cell.br.x},${cell.br.y}]`,cell.br.x,cell.br.y - 5,'white','20px');
                write(`[${cell.bl.x},${cell.bl.y}]`,cell.bl.x,cell.bl.y - 5,'white','20px');
                ctx.beginPath()
                ctx.fillStyle = "pink"
                ctx.fillRect(cell.tr.x - 5,cell.tr.y -5,10,10)
                ctx.fillStyle = "blue"
                ctx.fillRect(cell.tl.x - 5,cell.tl.y -5,10,10)
                ctx.fillStyle = "red"
                ctx.fillRect(cell.br.x - 5,cell.br.y -5,10,10)
                ctx.fillStyle = "yellow"
                ctx.fillRect(cell.bl.x - 5,cell.bl.y -5,10,10)
                ctx.closePath()
                this.iteration++;
                /* for(let k = 0; k < this.grid.x[0][0].length; k++){
                    let gx = this.grid.x[0][0][k]
                    this.iteration++;
                    ctx.fillRect(gx.x - 5,gx.y -5,10,10)
                } */
            }
        }
        
        debug('grid iter',this.iteration)
    }

    resetVars(){
        this.grid.x = [];
        this.grid.y = [];
        this.showConsoleEnabled = false
        this.iteration = 0;
    }

    debugEventHandler(e){
        if(e.key == 'b') this.toggleAllDebug();
        if(e.key == 'c') this.displayConsole();
    }
    toggleAllDebug(){
        this.allEnabled = !this.allEnabled;
    }
    displayConsole(){
        this.showConsoleEnabled = true;
    }
    consoleAllVars(){
        console.log('grid data', this.grid);
    }
}