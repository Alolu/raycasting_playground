const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;
const SCREEN = document.createElement('canvas');
const ctx = SCREEN.getContext('2d');

const TEX_WIDTH = 64;
const TEX_HEIGHT = 64

const game = new Game();

let oldtime = 0;
let rotatespeed;

let debugQueue = [], debugIdQueue = [];
let debugTextSize = 20

function update(time){
    invalidateCanvas();
    
    let framespeed = (time - oldtime) / 1000;
    rotatespeed = framespeed * 15
    movespeed = framespeed * 4

    game.update();
    displayDebug();

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

function write(text,x,y,color = 'white',font='10px'){
    ctx.beginPath()
    ctx.font = `${font} serif`;
    ctx.fillStyle = color
    ctx.fillText(text,x,y);
}

function debug(id,str){
    if(debugIdQueue.includes(id)) return;
    debugIdQueue.push(id);
    debugQueue.push(`${id}: ${str}`);
}

function displayDebug() {
    for(let i = 0; i < debugQueue.length; i++){
        write(debugQueue[i],10,debugTextSize*(i+1),'white',debugTextSize + 'px')
    }
    debugIdQueue = [];
    debugQueue = [];
}

init();