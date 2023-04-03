class Game {

    constructor(){
        let basePos = new Vector3(5,5,0.5 * SCREEN_HEIGHT)
        this.player = new Player(basePos,new Vector3(1,0));
        this.camera = new Camera(this,basePos)
        //this.floorCast = new FloorCast(this)
        //this.map = new Map(this)
        this.editor = new Editor()
    }

    textureLoader = new TextureLoader();

    update() {
        if(!this.textureLoader.loaded) return;
        //this.floorCast.update();
        this.camera.render = false;
        this.camera.update();
        //this.map.update();
        this.player.update();
        this.editor.render();
    }
}
