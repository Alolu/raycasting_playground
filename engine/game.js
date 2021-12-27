basePos = new Vector2D(5,5)

class Game {
    player = new Player(basePos);
    camera = new Camera(this,basePos);
    map = new Map(this);

    update() {
        this.camera.update();
        this.map.update();
    }
}
