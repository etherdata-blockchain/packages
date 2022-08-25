export interface CodeBlock<T> {
  id: number;
  /**
   * Code block type.
   */
  type: T;
  /**
   * Value holds by the variable.
   */
  value?: string;
  /**
   * Variable name.
   */
  name?: string;
  /**
   * Original code.
   */
  code: string;
  /**
   * Comments
   */
  description?: string;
  /**
   *
   */
  error: boolean;
  /**
   * Code's comment.
   */
  codeComment?: string;
}

export interface CodeParsingRequest {
  code: string;
  codeComment: string;
  numberOfLines: number;
  comment?: string;
}

export abstract class Parser<T> {
  codeBlockMatcher = /\/\/@codeblock/;

  /**
   * Parse code to a list of code blocks.
   * @param input The input code to parse.
   */
  parse(input: string): CodeBlock<T>[] {
    const lines = input.split("\n");
    const codeBlocks: CodeBlock<T>[] = [];
    // loop through each line
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      // if line is a code block
      if (this.codeBlockMatcher.test(line)) {
        // get the next line which is the code block
        // also check if current line is the last line
        if (i + 1 < lines.length) {
          const { code, numberOfLines, comment, codeComment } =
            this.getTillCode(lines.slice(i).join("\n"));
          // add the code block to the code blocks array
          codeBlocks.push(
            this.cleanCodeBlock(
              this.parseLine(code, codeBlocks.length, comment, codeComment)
            )
          );
          i += numberOfLines;
        } else {
          // if current line is the last line, add the default code block
          codeBlocks.push(this.defaultCodeBlock(line, codeBlocks.length));
          i += 1;
        }
      } else {
        // if line is not a code block, add the default code block
        codeBlocks.push(this.defaultCodeBlock(line, codeBlocks.length));
        i++;
      }
    }

    return codeBlocks;
  }

  /**
   * Given a list of code blocks, returns a code string
   */
  generate(input: CodeBlock<T>[]): string {
    let output = "";

    for (let i = 0; i < input.length; i++) {
      output += this.generateLine(input[i]);
      if (i < input.length - 1) {
        output += "\n";
      }
    }
    return output;
  }

  protected abstract defaultCodeBlock(
    input: string,
    index: number
  ): CodeBlock<T>;

  /**
   * Parse a line of code to a code block.
   */
  protected abstract parseLine(
    line: string,
    index: number,
    comment?: string,
    codeComment?: string
  ): CodeBlock<T>;

  protected abstract generateLine(input: CodeBlock<T>): string;

  /**
   * Clean a code block.
   * @param input Code Block
   * @returns Cleaned Code Block
   */
  protected abstract cleanCodeBlock(input: CodeBlock<T>): CodeBlock<T>;

  /**
   * Get everything starts with //@codeblock till the actual code.
   * For example, if the input is:
   * //@codeblock
   * // A comment
   * string a = "a";
   *
   * The output is
   * // A comment
   * string a = "a";
   *
   */
  protected abstract getTillCode(input: string): CodeParsingRequest;
}
