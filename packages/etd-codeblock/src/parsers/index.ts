import { Parser } from "./parser";
import { SolidityParser } from "./SolidityParser";

export function getParserByLanguage(language: string): Parser<any> {
  switch (language) {
    case "sol":
      return new SolidityParser();
    default:
      throw new Error(`Language ${language} not supported`);
  }
}
