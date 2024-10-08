export interface Scene {
  backgroundColor?:string
  identifer:string
  onLoad?():void
  onDestroy?():void
  draw(sceneContext:SceneRenderingContext):void
}

export type SceneRenderingContext = {
  ctx:CanvasRenderingContext2D,
  fps:number,
}

