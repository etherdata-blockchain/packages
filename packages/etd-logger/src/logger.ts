import moment from "moment";

export class Logger {
  static info(message: any) {
    console.log(`[INFO] ${moment().format("hh:mm:ss")} ${message}`);
  }

  static warning(message: any) {
    console.log(`[WARNING] ${moment().format("hh:mm:ss")} ${message}`);
  }

  static error(message: any) {
    console.log(`[Error] ${moment().format("hh:mm:ss")} ${message}`);
  }
}
