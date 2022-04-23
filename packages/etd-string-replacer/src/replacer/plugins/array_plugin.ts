import { ReplacerParam, ReplacerReturn } from "../types";
import { Plugin } from "./plugin";

export class ArrayPlugin extends Plugin {
  canHandle(param: ReplacerParam): boolean {
    // check if the given key is an array
    const regex = new RegExp(/\[\d+\]/);
    return regex.test(param.key);
  }

  handle(param: ReplacerParam): ReplacerReturn {
    // get the index of the array
    const regex = new RegExp(/\[(\d+)\]/);
    const match = regex.exec(param.key);
    let result = param.string;
    if (match) {
      const index = parseInt(match[1]);
      // get the value of the array
      const value = param.replacementMap[param.key.replace(regex, "")];
      if (value) {
        // replace the match with the value
        result = param.string.replace(param.match[0], value[index]);
      }
    }
    return {
      string: result === "undefined" ? "" : result,
      isFinished: true,
    };
  }
}
