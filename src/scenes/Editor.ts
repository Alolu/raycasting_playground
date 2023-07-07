import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";
import { Scene, SceneRenderingContext } from "../engine/scene";
import game from "../game";
import Test from "./Test";

export default class EditorScene implements Scene {

  backgroundColor = "#f2f1ed"
  zoom = 1.5
  zoomIncrementSpeed = 0.05
  baseSquareToPxUnit = 100
  squareToPxUnit = this.baseSquareToPxUnit
  squareNumbersX = SCREEN_WIDTH/this.squareToPxUnit
  squareNumbersY = SCREEN_HEIGHT/this.squareToPxUnit

  draw({ctx,fps}:SceneRenderingContext): void {
    ctx.beginPath()
    ctx.font = `30px serif`;
    ctx.fillStyle = "black"
    ctx.fillText(Math.ceil(fps).toString(),15,30);
    ctx.closePath()

    this.calcSquareAmount()
    this.drawMap(ctx)
  }

  scrollAction = (e: WheelEvent) => {
    console.log(this.zoom)
    if(e.deltaY < 0) this.zoom += this.zoomIncrementSpeed
    if(e.deltaY > 0 && this.zoom > 0.1) this.zoom -= this.zoomIncrementSpeed
  }

  onLoad(){
    addEventListener("wheel",this.scrollAction)
  }

  onDestroy() {
    removeEventListener("wheel",this.scrollAction)
  }

  calcSquareAmount(){
    this.squareToPxUnit = this.baseSquareToPxUnit * this.zoom
    this.squareNumbersX = SCREEN_WIDTH/this.squareToPxUnit
    this.squareNumbersY = SCREEN_HEIGHT/this.squareToPxUnit
  }

  drawMap(ctx:CanvasRenderingContext2D){
    ctx.beginPath()
    ctx.translate(.5,.5)
    ctx.lineWidth = 1
    ctx.strokeStyle = "#c4c2bc"

    for(let i = 0; i < this.squareNumbersX; i++){
      ctx.moveTo(i * this.squareToPxUnit, 0)
      ctx.lineTo(i * this.squareToPxUnit, SCREEN_HEIGHT)
      ctx.stroke()
    }

    for(let i = 0; i < this.squareNumbersY; i++){
      ctx.moveTo(0, i * this.squareToPxUnit)
      ctx.lineTo(SCREEN_WIDTH, i * this.squareToPxUnit)
      ctx.stroke()
    }

    ctx.resetTransform()
    ctx.closePath()
  }


}