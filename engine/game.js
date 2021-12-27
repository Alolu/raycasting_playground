class Game {
    player = new Player(new Vector2D(100,100))
    done;

    update() {
        for(let x = 0; x < SCREEN_WIDTH; x++){
            let cameraX = 2*x / SCREEN_WIDTH - 1;
            let rayDirX = this.player.dir.x + this.player.fov.x * cameraX;
            let rayDirY = this.player.dir.y + this.player.fov.y * cameraX;

            if(!this.done) console.log(rayDirX,rayDirY);
        }

        this.done = true;
        this.player.drawView()
    }
}
