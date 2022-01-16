import moment from "moment";
import chalk from "chalk";

export class Logger {
  static info(message: any) {
    console.log(
      `[${chalk.blue("INFO")}] ${chalk.gray(
        moment().format("hh:mm:ss")
      )} ${message}`
    );
  }

  static warning(message: any) {
    console.log(
      `[${chalk.yellow("WARNING")}] ${chalk.gray(
        moment().format("hh:mm:ss")
      )} ${message}`
    );
  }

  static error(message: any) {
    console.log(
      `[${chalk.red("Error")}] ${chalk.gray(
        moment().format("hh:mm:ss")
      )} ${message}`
    );
  }
}
