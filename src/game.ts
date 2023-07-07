import { SCREEN, SCREEN_WIDTH, SCREEN_HEIGHT, ctx } from "./constants";
import GameLoop from "./engine/gameloop"
import SceneManager from "./engine/scene/sceneManager";
import EditorScene from "./scenes/Editor";

const sceneManager:SceneManager = new SceneManager(new EditorScene())
const gameLoop:GameLoop = new GameLoop(ctx!,sceneManager)

function load():void {
  init()
  gameLoop.run(0)
}

function init(){
  if (ctx == null) return;

  SCREEN.width = SCREEN_WIDTH;
  SCREEN.height = SCREEN_HEIGHT;

  document.body.appendChild(SCREEN)

  ctx.fillStyle = '#fff'
  ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
}

export default { load, gameLoop: gameLoop, sceneManager }