export class StringReplacer {
  replacementMap: { [key: string]: any };

  constructor(replacementMap: { [key: string]: any }) {
    this.replacementMap = replacementMap;
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
      const value = this.replacementMap[key];
      if (value) {
        string = string.replace(match[0], value);
      } else {
        string = string.replace(match[0], "");
      }
      // reset regex
      regex.lastIndex = 0;
      match = regex.exec(string);
    }
    return string;
  }
}
