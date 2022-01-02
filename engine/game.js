class Game {

    constructor(){
        let basePos = new Vector3(10,10,0.5 * SCREEN_HEIGHT)
        this.player = new Player(basePos);
        this.camera = new Camera(this,basePos)
        this.floorCast = new FloorCast(this)
        this.map = new Map(this)
    }

    textureLoader = new TextureLoader();

    update() {
        if(!this.textureLoader.loaded) return;
        this.floorCast.update();
        this.camera.update();
        this.map.update();
        this.player.update();
    }
}
