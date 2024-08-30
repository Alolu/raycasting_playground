import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants"
import Loggable from "../engine/logging/Loggable"

const COORDS_MODE_ENABLED = true
const DEDBUG_MODE_ENABLED = false

export default class EditorController extends Loggable {

  zoom = 1
  zoomIncrementSpeed = 0.05
  baseSquareToPxUnit = SCREEN_WIDTH/10

  viewportWidth = SCREEN_WIDTH*(1/this.zoom)
  viewportHeight = SCREEN_HEIGHT*(1/this.zoom)

  displayDebugEnabled = DEDBUG_MODE_ENABLED
  coordsDisplayEnabled = COORDS_MODE_ENABLED
  dragModeEnabled = false

  squareToPxUnit = Math.floor(this.baseSquareToPxUnit * this.zoom)

  visibleSquareNumberX = (SCREEN_WIDTH / this.squareToPxUnit) + 1
  visibleSquareNumberY = (SCREEN_HEIGHT / this.squareToPxUnit) + 1

  offsetX = this.squareToPxUnit * 0
  offsetY = this.squareToPxUnit * 0

  dragX = 0
  dragY = 0

  offsetXBase = this.squareToPxUnit
  offsetYBase = this.squareToPxUnit

  offsetSquareX = Math.floor(this.offsetX / this.squareToPxUnit)
  offsetSquareY = Math.floor(this.offsetY / this.squareToPxUnit)

  dragHandler =(e:MouseEvent) => {
    /* this.offsetXBase = e.x
    this.offsetYBase = e.y */

    if(!this.dragModeEnabled) return

    let velocityX = e.x - this.dragX
    let velocityY = e.y - this.dragY

    this.offsetX += velocityX
    this.offsetY += velocityY

    this.dragX = e.x
    this.dragY = e.y
  }

  calcSquareAmount() {
    Math.floor(this.squareToPxUnit = this.baseSquareToPxUnit * this.zoom)

    this.visibleSquareNumberX = (SCREEN_WIDTH / this.squareToPxUnit) + 1
    this.visibleSquareNumberY = (SCREEN_HEIGHT / this.squareToPxUnit) + 1

    this.offsetSquareX = -Math.floor(this.offsetX / this.squareToPxUnit)
    this.offsetSquareY = -Math.floor(this.offsetY / this.squareToPxUnit)

    this.viewportWidth = SCREEN_WIDTH*(1/this.zoom)
    this.viewportHeight = SCREEN_HEIGHT*(1/this.zoom)
  }

  //? Tile offset is always negative
  calcCanvasOffset(offset: number) {
    let tileOffset = (((offset % this.squareToPxUnit) / this.squareToPxUnit) * this.squareToPxUnit)
    return tileOffset >= 0 ? tileOffset - this.squareToPxUnit : tileOffset
  }

  calcInnerOffset(x:number) {
    return 
  }

  drawLines(canvas: CanvasRenderingContext2D){
    canvas.lineWidth = 1
    canvas.strokeStyle = "red"
    for (let i = 0; i < this.visibleSquareNumberX; i++) {
      canvas.moveTo(this.getX(i), 0)
      canvas.lineTo(this.getX(i), SCREEN_HEIGHT)
      canvas.stroke()
    }
  }

  drawMap(canvas: CanvasRenderingContext2D) {
    canvas.beginPath()
    canvas.translate(.5, .5)
    canvas.lineWidth = 1
    canvas.strokeStyle = "#c4c2bc"

    for (let i = 0; i < this.visibleSquareNumberX; i++) {
      canvas.moveTo(this.getX(i), 0)
      canvas.lineTo(this.getX(i), SCREEN_HEIGHT)
      canvas.stroke()
    }

    for (let i = 0; i < this.visibleSquareNumberY; i++) {
      canvas.moveTo(0, this.getY(i))
      canvas.lineTo(SCREEN_WIDTH, this.getY(i))
      canvas.stroke()    
    }

    canvas.resetTransform()
    canvas.closePath()
  }
  
  debug(canvas:CanvasRenderingContext2D){
    canvas.font = "20px Consolas"
    canvas.fillStyle = "black"

    if(!this.displayDebugEnabled) return
    canvas.fillText("zoom: " + this.zoom.toString(),50,50)
    canvas.fillText(`canvas offset X: ${this.calcCanvasOffset(this.offsetX)}`, 50, 70)
    canvas.fillText(`offset x: ${this.offsetX}`, 50, 90)
    canvas.fillText(`base square px: ${this.baseSquareToPxUnit}`, 50, 110)
  }

  drawCoords(canvas: CanvasRenderingContext2D) {
    canvas.font = "20px Consolas"
    canvas.fillStyle = "black"

    if(!this.coordsDisplayEnabled) return
    for (let x = 0; x < this.visibleSquareNumberX; x++) {
      for (let y = 0; y < this.visibleSquareNumberY; y++) {
        this.writeCoords(canvas,x,y)
      }
    }
  }

  writeCoords(canvas:CanvasRenderingContext2D,x:number,y:number){
    canvas.fillText(`${x + this.offsetSquareX - 1},${y + this.offsetSquareY - 1}`,
      this.getX(x) + 5,
      this.getY(y) + 20
    )

    canvas.fillText(`x: ${Math.floor(this.getX(x))}px`,
      this.getX(x) + 5,
      this.getY(y) + 40
    )

    canvas.fillText(`y: ${Math.floor(this.getY(y))}px`,
      this.getX(x) + 5,
      this.getY(y) + 60
    )

    canvas.fillText(`actual x: ${Math.floor(this.getX(x) - this.offsetX)}px`,
      this.getX(x) + 5,
      this.getY(y) + 80
    )
    canvas.fillText(`actual y: ${Math.floor(this.getY(y) - this.offsetY)}px`,
      this.getX(x) + 5,
      this.getY(y) + 100
    )
  }

  //? on veux un point de base (genre le centre), et qu'a partir de ce point de base, on calcule tous les offset des tiles

  getX(x:number){
    return (x * this.squareToPxUnit) + this.calcCanvasOffset(this.offsetX)
  }

  getY(y:number){
    return (y * this.squareToPxUnit) + this.calcCanvasOffset(this.offsetY)
  }

  logAction = () => {
  }

  scrollAction = (e: WheelEvent) => {
    //? Scroll up
    if (e.deltaY < 0) {
      this.zoom += this.zoomIncrementSpeed
      //this.offsetX += (SCREEN_WIDTH*(1/this.zoom) - this.viewportWidth)/2
      //this.offsetY += (SCREEN_HEIGHT*(1/this.zoom) - this.viewportHeight)/2
    }
    //? Scroll down
    if (e.deltaY > 0 && this.zoom > 0.1) {
      this.zoom -= this.zoomIncrementSpeed
      //this.offsetX += (SCREEN_WIDTH*(1/this.zoom) - this.viewportWidth)/2
      //this.offsetY += (SCREEN_HEIGHT*(1/this.zoom) - this.viewportHeight)/2
    }
  }

  incrementOffset(value:number){
    this.offsetX += value
    this.offsetY += value
  }

  reset = () => {
    this.offsetX = 0
    this.offsetY = 0
  }
}