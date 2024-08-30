
import Loggable from "../logging/Loggable";
import { Scene, SceneRenderingContext } from "./Scene";

const LOGGER_ID = "Scene Manager"

export default class SceneManager extends Loggable {
  loadedScene: Scene = {} as Scene
  id = LOGGER_ID

  loadScene(scene:Scene){
    this.logger.info(`Loading scene: ${scene.identifer}`)
    if(this.loadedScene && this.loadedScene.onDestroy) {
      this.logger.info(`Firing destroy event for ${this.loadedScene.identifer}`)
      this.loadedScene.onDestroy()
      this.logger.info(`destroy event completed for ${this.loadedScene.identifer}`)
    }
    this.loadedScene = scene
    this.logger.info('Scene successfully loaded!')
    if(scene.onLoad) {
      this.logger.info(`Firing load event for ${scene.identifer}`)
      scene.onLoad()
      this.logger.info(`load event completed for ${scene.identifer}`)
    }
  }

  render(sceneContext:SceneRenderingContext){
    this.loadedScene.draw(sceneContext)
  }

  get backgroundColor(){
    return this.loadedScene.backgroundColor
  }
}