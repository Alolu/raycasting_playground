const SCREEN_WIDTH = 640;
const SCREEN_HALF_WIDTH = SCREEN_WIDTH/2;
const SCREEN_HEIGHT = 480;
const SCREEN_HALF_HEIGHT = SCREEN_HEIGHT/2;
const SCREEN = document.createElement('canvas');

const FRAME_PER_SECONDS = 60;
const FRAMERATE = 1 / FRAME_PER_SECONDS;

init();
main();

const SCREEN_CONTEXT = SCREEN.getContext('2d');

/**
 * Initiate the canvas and calculated variables
 */
function init(){
    SCREEN.width = SCREEN_WIDTH;
    SCREEN.height = SCREEN_HEIGHT;
    SCREEN.style.border = '1px solid black'

    document.body.appendChild(SCREEN)
}

/**
 * Clear screen
 */
 function clearScreen() {
    SCREEN_CONTEXT.fillStyle = 'black'
    SCREEN_CONTEXT.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

/**
 * Main loop of the game
 */
function main(){
    setInterval(function() {
        clearScreen();
        raycasting();
    }, FRAMERATE);
}
