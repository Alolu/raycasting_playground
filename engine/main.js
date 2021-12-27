const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;
const SCREEN = document.createElement('canvas');
const ctx = SCREEN.getContext('2d');

const game = new Game();

let oldtime = 0;

function update(time){
    invalidateCanvas();
    oldtime = time

    game.update();
    
    requestAnimationFrame(update);
}

function init(){
    SCREEN.width = SCREEN_WIDTH;
    SCREEN.height = SCREEN_HEIGHT;
    SCREEN.style.border = '1px solid black'

    document.body.appendChild(SCREEN)
    requestAnimationFrame(update);
}

function invalidateCanvas(){
    ctx.beginPath()
    ctx.fillStyle = 'black'
    
    ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
}

function write(text,x,y){
    ctx.beginPath()
    ctx.font = "30px serif";
    ctx.fillStyle = 'white'
    ctx.fillText(text,x,y);
}

init();