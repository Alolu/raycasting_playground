const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;
const SCREEN = document.createElement('canvas');
const ctx = SCREEN.getContext('2d');

const game = new Game();

let oldtime = 0;
let rotatespeed; 

function update(time){
    invalidateCanvas();
    
    let framespeed = (time - oldtime) / 1000;
    rotatespeed = framespeed * 3
    movespeed = framespeed * 3

    game.update();

    requestAnimationFrame(update);
    oldtime = time
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

function write(text,x,y,color = 'white'){
    ctx.beginPath()
    ctx.font = "30px serif";
    ctx.fillStyle = color
    ctx.fillText(text,x,y);
}

init();