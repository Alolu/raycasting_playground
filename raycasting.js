
let PLAYER_ANGLE = 90
const FOV = 60
const PRECISION = 64;
const pos = {
    x: 2,
    y: 2,
}

/**
 * Raycasting engine
 */
function raycasting() {
    let rayAngle =  PLAYER_ANGLE - (FOV/2)

    for(let i = 0; i < SCREEN_WIDTH; i++) {

        let ray = {
            x: pos.x,
            y: pos.y,
        }

        let rayCos = Math.cos(degreeToRadians(rayAngle)) / PRECISION;
        let raySin = Math.sin(degreeToRadians(rayAngle)) / PRECISION;

        let wall = 0;
        while(wall == 0) {
            ray.x += rayCos;
            ray.y += raySin;
            wall = MAP[Math.floor(ray.y)][Math.floor(ray.x)];
        }

        let distance = Math.sqrt(Math.pow(pos.x - ray.x, 2) + Math.pow(pos.y - ray.y, 2));

        // Wall height
        let wallHeight = Math.floor(SCREEN_HALF_HEIGHT / distance);

        // Draw
        drawLine(SCREEN_CONTEXT, i, 0, i,  SCREEN_HALF_HEIGHT - wallHeight, "cyan");
        drawLine(SCREEN_CONTEXT,i, SCREEN_HALF_HEIGHT - wallHeight, i, SCREEN_HALF_HEIGHT + i, "red");
        drawLine(SCREEN_CONTEXT,i, SCREEN_HALF_HEIGHT + wallHeight, i, SCREEN_HEIGHT, "green");

        rayAngle += FOV/SCREEN_WIDTH;
    }

}
