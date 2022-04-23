import { ReplacerParam, ReplacerReturn } from "../types";
import { Plugin } from "./plugin";

export class MapPlugin extends Plugin {
  handle({
    key,
    replacementMap,
    string,
    match,
  }: ReplacerParam): ReplacerReturn {
    const parts = key.split(".");
    let value = replacementMap[parts[0]];
    key = key.replace(`${parts[0]}.`, "");
    for (let i = 1; i < parts.length; i++) {
      if (value) {
        const part = parts[i];
        const replacedResult = this.useReplaceFunc!({
          key: key.replace(`${part}.`, ""),
          replacementMap: value[part],
          match,
          string,
        });
        value = value[part];
        string = replacedResult.string;
        key = key.replace(`${part}.`, "");
      } else {
        break;
      }
    }
    if (value) {
      string = string.replace(match[0], value);
    }
    return {
      string,
      isFinished: true,
    };
  }

  canHandle({ key }: ReplacerParam): boolean {
    const parts = key.split(".");
    return parts.length > 1;
  }
}
