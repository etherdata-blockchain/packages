import { ReplacerParam, ReplacerReturn } from "../types";

export abstract class Plugin {
  /**
   * Handle the replacement of the given match using other plugins.
   * This function will be initialize when the plugin is added to the replacer.
   * @param {ReplacerParam} param
   */
  useReplaceFunc: ((param: ReplacerParam) => ReplacerReturn) | undefined;

  abstract canHandle(param: ReplacerParam): boolean;

  /**
   * Handle the replacement of the given match.
   * @param param
   */
  abstract handle(param: ReplacerParam): ReplacerReturn;
}
