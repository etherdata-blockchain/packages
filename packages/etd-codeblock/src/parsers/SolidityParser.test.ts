import { SolidityParser } from "./SolidityParser";

describe("Given a solidity parser", () => {
  test("Should parse code correctly", () => {
    const parser = new SolidityParser();
    const input = `
        contract HelloWorld {
          function hello() public {
            //@codeblock
            address myAddress = "0xabcde";

            return "hello world";
          }
        }
        `;
    const output = parser.parse(input);
    expect(output).toHaveLength(9);
    expect(output[3].type).toBe("address");
    expect(output[3].value).toBe("0xabcde");
    expect(output[3].name).toBe("myAddress");
  });

  test("Should parse code correctly", () => {
    const parser = new SolidityParser();
    const input = `
        contract HelloWorld {
          function hello() public {
            //@codeblock
            address myAddress = "0xabcde";
            address yourAddress = "0xabcdef"

            return "hello world";
          }
        }
        `;
    const output = parser.parse(input);
    expect(output).toHaveLength(10);
    expect(output[3].type).toBe("address");
    expect(output[3].value).toBe("0xabcde");
    expect(output[3].name).toBe("myAddress");
  });

  test("Should parse code correctly for multiple blocks", () => {
    const parser = new SolidityParser();
    const input = `
    //@codeblock
    string a = "a";
    //@codeblock
    string b = "b";
    //@codeblock
    int c = 1;
        `;
    const output = parser.parse(input);
    expect(output).toHaveLength(5);
    expect(output[1].name).toBe("a");
    expect(output[2].name).toBe("b");
    expect(output[3].name).toBe("c");

    expect(output[1].id).toBe(1);
    expect(output[2].id).toBe(2);
    expect(output[3].id).toBe(3);
  });

  test("Should parse code correctly with comments", () => {
    const parser = new SolidityParser();
    const input = `
    //@codeblock
    // This is a comment
    string a = "a";`;
    const output = parser.parse(input);
    expect(output).toHaveLength(2);
    expect(output[1].name).toBe("a");
    expect(output[1].id).toBe(1);
    expect(output[1].value).toBe("a");
  });

  test("Should parse code correctly with comments", () => {
    const parser = new SolidityParser();
    const input = `
    //@codeblock
    /**
     * This is a comment
     */
    string a = "a";`;
    const output = parser.parse(input);
    expect(output).toHaveLength(2);
    expect(output[1].name).toBe("a");
    expect(output[1].id).toBe(1);
    expect(output[1].value).toBe("a");
  });

  test("Should parse code correctly with comments", () => {
    const parser = new SolidityParser();
    const input = `
    //@codeblock
    // This is a comment
    
    string a = "a";`;
    const output = parser.parse(input);
    expect(output).toHaveLength(2);
    expect(output[1].name).toBe("a");
    expect(output[1].id).toBe(1);
    expect(output[1].value).toBe("a");
  });

  test("Should generate code correctly", () => {
    const parser = new SolidityParser();
    const input = `
        contract HelloWorld {
          function hello() public {
            //@codeblock
            address myAddress = "0xabcde";
            address yourAddress = "0xabcdef"

            return "hello world";
          }
        }
        `;
    const blocks = parser.parse(input);
    blocks[3].value = "0xnewAddress";
    const output = parser.generate(blocks);
    expect(output).toContain('            address myAddress = "0xnewAddress"');
    expect(output).toContain("//@codeblock");
  });

  test("Should generate code correctly with comment", () => {
    const parser = new SolidityParser();
    const input = `
        contract HelloWorld {
          function hello() public {
            //@codeblock
            // This is a comment
            address myAddress = "0xabcde";
            address yourAddress = "0xabcdef"

            return "hello world";
          }
        }
        `;
    const expectedInput = `
        contract HelloWorld {
          function hello() public {
            //@codeblock
            // This is a comment
            address myAddress = "0xnewAddress";
            address yourAddress = "0xabcdef"

            return "hello world";
          }
        }
        `;
    const blocks = parser.parse(input);
    blocks[3].value = "0xnewAddress";
    const output = parser.generate(blocks);
    expect(output).toBe(expectedInput);
  });

  test("Should generate code correctly with comments", () => {
    const parser = new SolidityParser();
    const input = `
    //@codeblock
    /**
     * This is a comment
     */
    string a = "a";`;
    const blocks = parser.parse(input);
    const output = parser.generate(blocks);

    expect(output).toBe(input);
  });
});
