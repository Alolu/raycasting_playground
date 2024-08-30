import EditorController from "../controllers/EditorController";
import { Scene, SceneRenderingContext } from "../engine/scene/Scene";

const SCENE_IDENTIFER = "editor_1"
const SCENE_BACKGROUND = "#f2f1ed"

export default class EditorScene implements Scene {

  backgroundColor = SCENE_BACKGROUND
  identifer: string = SCENE_IDENTIFER

  editorController:EditorController = new EditorController()

  draw({ctx}:SceneRenderingContext): void {
    this.editorController.calcSquareAmount()
    this.editorController.drawMap(ctx)
    this.editorController.drawCoords(ctx)
    this.editorController.debug(ctx)
  }

  enableDragMode = (e: MouseEvent) => {
    this.editorController.dragX = e.x
    this.editorController.dragY = e.y
    this.editorController.dragModeEnabled = true
  }

  disableDragMode = () => this.editorController.dragModeEnabled = false

  mapControlHandler = (e:KeyboardEvent) => {
    if(e.key === "c") this.editorController.coordsDisplayEnabled = !this.editorController.coordsDisplayEnabled
    if(e.key === "a") this.editorController.logAction()
    if(e.key === "d") this.editorController.displayDebugEnabled = !this.editorController.displayDebugEnabled
    if(e.key === "r") this.editorController.reset()
  }

  onLoad(){
    addEventListener("wheel",this.editorController.scrollAction)
    addEventListener("keydown", this.mapControlHandler)
    addEventListener("mousedown", this.enableDragMode)
    addEventListener("mouseup", this.disableDragMode)
    addEventListener("mousemove", this.editorController.dragHandler)
  }

  onDestroy() {
    removeEventListener("wheel",this.editorController.scrollAction)
  }
}