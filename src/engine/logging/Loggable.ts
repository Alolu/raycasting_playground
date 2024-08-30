import { logger } from "../../game";

export default class Loggable {

  id?:string

  logger = {
    info:(message:any) => {
      logger.info(this.id || this.constructor.name, message)
    }
  }
}