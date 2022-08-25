import { CodeBlock, CodeParsingRequest, Parser } from "./parser";

export type SolidityType = "int" | "string" | "address" | "bool";

export class SolidityParser extends Parser<SolidityType> {
  protected getTillCode(input: string): CodeParsingRequest {
    // find the first line that is not a comment
    const lines = input.split("\n");
    let comments = "";
    let index = 0;
    let inComment = false;
    let code = "";
    let codeComment = "";

    while (index < lines.length) {
      const trimedLine = lines[index].trim();
      const line = lines[index];
      if (this.codeBlockMatcher.test(trimedLine)) {
        code += line + "\n";
        index++;
        continue;
      }

      if (trimedLine.startsWith("//")) {
        comments += trimedLine.substring(2) + "\n";
        codeComment += line + "\n";
        index++;
        continue;
      }

      if (trimedLine.startsWith("/*")) {
        comments += trimedLine.substring(2) + "\n";
        codeComment += line + "\n";
        inComment = true;
        index++;
        continue;
      }

      if (trimedLine.endsWith("*/")) {
        comments += trimedLine.substring(0, trimedLine.length - 2) + "\n";
        codeComment += line + "\n";
        inComment = false;
        index++;
        continue;
      }

      if (inComment && trimedLine.startsWith("*")) {
        comments += trimedLine.substring(1) + "\n";
        codeComment += line + "\n";
        index++;
        continue;
      }

      if (trimedLine.length === 0) {
        index++;
        continue;
      }
      break;
    }
    code += lines[index];
    return {
      code,
      codeComment,
      numberOfLines: index + 1,
      comment: comments.trim(),
    };
  }

  protected defaultCodeBlock(
    input: string,
    index: number
  ): CodeBlock<SolidityType> {
    return {
      id: index,
      type: "string",
      code: input,
      error: false,
    };
  }
  protected cleanCodeBlock(
    input: CodeBlock<SolidityType>
  ): CodeBlock<SolidityType> {
    let { value, type } = input;
    if (value === undefined) {
      return input;
    }

    switch (type) {
      case "string":
      case "address":
        value = value.replaceAll('"', "");
      default:
        break;
    }

    return {
      ...input,
      value,
    };
  }

  private valueToString(value: string, type: SolidityType): string {
    switch (type) {
      case "string":
      case "address":
        return `"${value}"`;
      default:
        return value;
    }
  }

  protected generateLine(input: CodeBlock<SolidityType>): string {
    const oldCodeBlock = this.cleanCodeBlock(
      this.parseLine(input.code, input.id)
    );

    if (oldCodeBlock.name !== undefined) {
      // get codeblock marker and actual code
      let lines = oldCodeBlock.code.split("\n");
      let length = lines.length;
      let numLeadingSpaces =
        lines[length - 1].length - lines[length - 1].trim().length;
      let code = lines.slice(0, length - 1);
      // get number of spaces before the actual code
      let leadingSpace =
        numLeadingSpaces > 0 ? " ".repeat(numLeadingSpaces) : "";
      // add comment to the code
      if (input.codeComment !== undefined && input.codeComment.length > 0) {
        // get rid of the next line character if it is there
        let comment = input.codeComment.endsWith("\n")
          ? input.codeComment.substring(0, input.codeComment.length - 1)
          : input.codeComment;
        code.push(comment);
      }
      // add new line character to the end of the code
      code.push(
        `${leadingSpace}${input.type} ${input.name} = ${this.valueToString(
          input.value!,
          input.type
        )};`
      );
      return code.join("\n");
    }

    return input.code;
  }

  protected parseLine(
    line: string,
    index: number,
    comment?: string,
    codeComment?: string
  ): CodeBlock<SolidityType> {
    const code = line.split("\n")[1];
    if (code === undefined) {
      return this.defaultCodeBlock(line, index);
    }

    // gets type, name and value from solidity code
    // for example, address x = 1 will be split to ["address", "x", "1"]
    const [lhs, rhs] = code.trim().split("=");
    if (lhs === undefined || rhs === undefined) {
      return this.defaultCodeBlock(line, index);
    }
    const [type, name] = lhs.split(" ");
    const value = rhs.replace(";", "").trim();
    return {
      id: index,
      type: type as SolidityType,
      value: value,
      name: name,
      code: line,
      error: false,
      description: comment,
      codeComment: codeComment,
    };
  }
}
