import { DEFAULT_SCREEN_COLOR, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";
import SceneManager from "./scene/sceneManager";

export default class GameLoop {
  
  sceneManager:SceneManager
  ctx: CanvasRenderingContext2D
  deltaTime: number = 0
  oldTime: number = 0 

  constructor(ctx:CanvasRenderingContext2D, sceneManager:SceneManager){
    this.ctx = ctx
    this.sceneManager = sceneManager
  }
  
  run(time: number){
    this.calculateFrames(time)
    this.render()
    requestAnimationFrame(this.run.bind(this))
  }

  render(){
    this.invalidate()
    this.sceneManager.render({ctx: this.ctx,fps: 1/this.deltaTime})
  }

  calculateFrames(time: number) {
    this.deltaTime = (time - this.oldTime) / 1000;
    this.oldTime = time
  }

  invalidate() {
    this.ctx.beginPath()
    this.ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT)
    this.ctx.fillStyle = this.sceneManager.backgroundColor || DEFAULT_SCREEN_COLOR
    this.ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT)
    this.ctx.closePath()
  }
}