export type ReplacementMap = { [key: string]: any };
export type ReplacerParam = {
  match: RegExpExecArray;
  key: string;
  string: string;
  replacementMap: ReplacementMap;
};
export type ReplacerReturn = {
  string: string;
  isFinished: boolean;
};
