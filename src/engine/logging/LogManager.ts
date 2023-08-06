export default class LogManager {

  convertToStyled(title:string,message:any) {
    return `\x1B[44;97m[${title}]\x1B[m \x1B[97m${message}\x1B[m`
  }

  info(title:string,message:any){
    let formattedMessage = this.convertToStyled(title,message)
    console.debug(formattedMessage)
  }
}