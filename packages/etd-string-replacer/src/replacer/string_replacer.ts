import { Plugin, StringPlugin } from "./plugins";
import { ArrayPlugin } from "./plugins/array_plugin";
import { MapPlugin } from "./plugins/map_plugin";
import { ReplacementMap, ReplacerParam, ReplacerReturn } from "./types";

export class StringReplacer {
  replacementMap: ReplacementMap;
  plugins: Plugin[] = [];

  constructor(replacementMap: ReplacementMap) {
    this.replacementMap = replacementMap;
    this.addPlugin(new StringPlugin())
      .addPlugin(new MapPlugin())
      .addPlugin(new ArrayPlugin());
  }

  addPlugin(plugin: Plugin) {
    plugin.useReplaceFunc = this.replace.bind(this);
    this.plugins.push(plugin);
    return this;
  }

  /**
   * Replace all the keys and values in the string with the values in the replacement map
   *
   * @param object Replaces all the keys and values in the object with the values in the replacement map
   */
  replaceObject(object: { [key: string]: any }) {
    const deepCopied: { [key: string]: any } = JSON.parse(
      JSON.stringify(object)
    );
    for (const [key, value] of Object.entries(deepCopied)) {
      if (typeof value === "string") {
        deepCopied[key] = this.replaceString(value);
      } else if (typeof value === "object") {
        deepCopied[key] = this.replaceObject(value);
      }
    }
    return deepCopied;
  }

  /**
   * Replace string ${{ key }} with value from replacementMap
   *
   * @param string Replaces all the keys in the string with the values in the replacement map
   */
  replaceString(string: string) {
    const regex = /\$\{\{(.*?)\}\}/g;
    let match = regex.exec(string);

    while (match) {
      // shrink empty spaces
      const key = match[1].trim();
      const result = this.replace({
        match,
        key,
        string,
        replacementMap: this.replacementMap,
      });
      string = result.string;

      // reset regex
      regex.lastIndex = 0;
      match = regex.exec(string);
    }
    return string;
  }

  private replace({
    match,
    key,
    string,
    replacementMap,
  }: ReplacerParam): ReplacerReturn {
    if (replacementMap === undefined) {
      return {
        string,
        isFinished: true,
      };
    }
    let [result, isFinished] = [string, false];
    for (const plugin of this.plugins) {
      if (plugin.canHandle({ match, key, string: result, replacementMap })) {
        const { string: newString, isFinished: newIsFinished } = plugin.handle({
          match,
          key,
          string: result,
          replacementMap,
        });
        result = newString;
      }
    }

    // if none of the plugins can handle this, then replace it with an empty string
    if (result === string) {
      result = result.replace(match[0], "");
    }

    return { string: result, isFinished };
  }
}
