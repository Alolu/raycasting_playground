import { Scene, SceneRenderingContext } from "../scene";

export default class SceneManager {
  loadedScene: Scene = {} as Scene

  constructor(scene:Scene){
    this.loadScene(scene)
  }

  loadScene(scene:Scene){
    console.log("[SCENE MANAGER] loading scene ", typeof scene)
    if(this.loadedScene.onDestroy) this.loadedScene.onDestroy()
    if(scene.onLoad) scene.onLoad()
    this.loadedScene = scene
  }

  render(sceneContext:SceneRenderingContext){
    this.loadedScene.draw(sceneContext)
  }

  get backgroundColor(){
    return this.loadedScene.backgroundColor
  }
}