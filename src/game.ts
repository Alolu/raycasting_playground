import { SCREEN, SCREEN_WIDTH, SCREEN_HEIGHT, ctx } from "./constants";
import GameLoop from "./engine/gameloop"
import LogManager from "./engine/logging/LogManager";
import SceneManager from "./engine/scene/sceneManager";
import EditorScene from "./scenes/Editor";

const logManager:LogManager = new LogManager()
const sceneManager:SceneManager = new SceneManager()
const gameLoop:GameLoop = new GameLoop(ctx!,sceneManager)

function init(){
  if (ctx == null) return;

  SCREEN.width = SCREEN_WIDTH;
  SCREEN.height = SCREEN_HEIGHT;

  document.body.appendChild(SCREEN)

  ctx.fillStyle = '#fff'
  ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

  sceneManager.loadScene(new EditorScene())
}

function load():void {
  init()
  logManager.info("game","Running gameloop")
  gameLoop.run(0)
}

export default { load, gameLoop, sceneManager}
export const logger = logManager;