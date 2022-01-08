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

    pushGridCoords(x,y,xpos,ypos){
        let coordVec = new Vector3(x,y);

        if(!this.grid.x[xpos]) {
            this.grid.x[xpos] = []
            this.grid.x[xpos][ypos] = [coordVec,coordVec,coordVec,coordVec]
            return;
        }
        if(!this.grid.x[xpos][ypos]) {
            this.grid.x[xpos][ypos] = [coordVec,coordVec,coordVec,coordVec]
            return;
        }

        let coords = this.grid.x[xpos][ypos];

        if(y > coords[1].y){
            coords[1] = coordVec;
        }

        //this.grid.x[xpos][ypos].push(coordVec)
        //if(coordVec.y > coords[1].y) coords[1] = coordVec;
    }

    drawGrid(){
        this.grid.x = this.grid.x.filter(e=>e);

        ctx.fillStyle = "pink"
        ctx.beginPath()
        for(let i = 0; i < this.grid.x.length; i++){
            this.grid.x[i] = this.grid.x[i].filter(e=>e);
            for(let j = 0; j < this.grid.x[i].length; j++){
                for(let k = 0; k < this.grid.x[i][j].length; k++){
                    let gx = this.grid.x[i][j][k]
                    this.iteration++;
                    ctx.fillRect(gx.x,gx.y,10,10)
                }
            }
        }
        ctx.closePath()
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