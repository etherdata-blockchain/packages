import { Plugin } from "./plugin";
import { ReplacerParam, ReplacerReturn } from "../types";

export class StringPlugin extends Plugin {
  handle({
    replacementMap,
    string,
    match,
    key,
  }: ReplacerParam): ReplacerReturn {
    const value = replacementMap[key];
    if (value) {
      string = string.replace(match[0], value);
    }
    return { string, isFinished: true };
  }

  canHandle({ key }: ReplacerParam): boolean {
    const regex = new RegExp(/[\w.]/);
    const matches = key.match(regex);
    return Boolean(matches) && matches!.length === 1;
  }
}
