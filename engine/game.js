basePos = new Vector2D(5,5)

class Game {
    textureLoader = new TextureLoader();
    player = new Player(basePos);
    camera = new Camera(this,basePos);
    map = new Map(this);

    update() {
        if(!this.textureLoader.loaded) return;
        this.camera.update();
        this.map.update();
        this.player.update();
    }
}
