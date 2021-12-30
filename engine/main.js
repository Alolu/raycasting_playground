const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const SCREEN = document.createElement('canvas');
const ctx = SCREEN.getContext('2d');

const TEX_WIDTH = 64;
const TEX_HEIGHT = 64

let framespeed;

const game = new Game();

let oldtime = 0;
let rotatespeed;

let debugQueue = [], debugIdQueue = [];
let debugTextSize = 20,
    debugColor = 'black'

function update(time){
    invalidateCanvas();
    
    framespeed = (time - oldtime) / 1000;
    rotatespeed = framespeed * 15
    movespeed = framespeed * 4
    
    game.update();
    displayDebug();

    oldtime = time
    debug('FPS',1/framespeed)
    requestAnimationFrame(update);
}

function init(){
    SCREEN.width = SCREEN_WIDTH;
    SCREEN.height = SCREEN_HEIGHT;
    SCREEN.style.border = '1px solid black'

    document.body.appendChild(SCREEN)
    SCREEN.requestPointerLock = SCREEN.requestPointerLock || SCREEN.mozRequestPointerLock;
    SCREEN.onclick = () => {
        SCREEN.requestPointerLock();
    }


    requestAnimationFrame(update);
}

function invalidateCanvas(){
    ctx.beginPath()
    ctx.fillStyle = '#BAF8FF'
    ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT/2);
    ctx.fillStyle = '#333333'
    ctx.fillRect(0,SCREEN_HEIGHT/2,SCREEN_WIDTH,SCREEN_HEIGHT);
    //ctx.fillStyle = 'white'
    //ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
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
        write(debugQueue[i],10,debugTextSize*(i+1),debugColor,debugTextSize + 'px')
    }
    debugIdQueue = [];
    debugQueue = [];
}

function decToRGB(decimal) {
    return [(decimal >> 16) & 0xff,(decimal >> 8) & 0xff,decimal & 0xff]
}

init();