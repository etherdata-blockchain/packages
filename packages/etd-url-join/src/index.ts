function normalize(strArray: string[]) {
  let resultArray = [];
  if (strArray.length === 0) {
    return "";
  }

  // If the first part is a plain protocol, we combine it with the next part.
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    let first = strArray.shift();
    strArray[0] = first + strArray[0];
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
  }

  for (let i = 0; i < strArray.length; i++) {
    let component = strArray[i];

    if (component === "") {
      continue;
    }

    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[\/]+/, "");
    }
    if (i < strArray.length - 1) {
      // Removing the ending slashes for each component but the last.
      component = component.replace(/[\/]+$/, "");
    } else {
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/[\/]+$/, "/");
    }

    if (i === 0 && strArray.length > 1) {
      component = ensureHttpEndingSlash(component);
      component = ensureFileEndingSlashes(component);
    }

    resultArray.push(component);
  }

  let str = resultArray.join("/");
  // Each input component is now separated by a single slash except the possible first plain protocol part.

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/g, "$1");

  // replace ? in parameters with &
  let parts = str.split("?");
  str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");

  return str;
}

/**
 * Ensure that http component only end with one slash.
 * For example, given a http:// should become http:/
 * and http: will become http:/
 * and http://abc will not be changed
 * @param component
 */
function ensureHttpEndingSlash(component: string) {
  const endingSlashesRegex = /https?:[\/]+$/g;
  const endingNoSlashRegex = /https?:$/g;
  // ending with double slash
  const endingSlashes = endingSlashesRegex.test(component);
  // ending without slash
  const endingNoSlash = endingNoSlashRegex.test(component);
  if (endingSlashes) {
    return component.replace(/[\/]+$/, "/");
  }

  if (endingNoSlash) {
    return `${component}/`;
  }
  return component;
}

/**
 * Ensure the file protocol will ending with 2 slashes
 * @param component
 */
function ensureFileEndingSlashes(component: string) {
  const endingSlashesRegex = /file:[\/]+$/g;
  const endingNoSlashRegex = /file:$/g;
  // ending with double slash
  const endingSlashes = endingSlashesRegex.test(component);
  // ending without slash
  const endingNoSlash = endingNoSlashRegex.test(component);
  if (endingSlashes) {
    return component.replace(/[\/]+$/, "//");
  }

  if (endingNoSlash) {
    return `${component}//`;
  }
  return component;
}

/**
 * Given a list of parameters, join them together based on URL standard.
 * @param parameters{string[]} list of url parts
 */
export default function urlJoin(...parameters: string[]) {
  return normalize(parameters);
}
