import { StringReplacer } from "../replacer/replacer";

describe("Given a replacer", () => {
  test("When replacing string", () => {
    const replacer = new StringReplacer({ world: "world" });
    const result = replacer.replaceString("hello ${{ world }}");
    expect(result).toBe("hello world");
  });

  test("When replacing string multiple", () => {
    const replacer = new StringReplacer({ world: "world" });
    const result = replacer.replaceString("hello ${{ world }} ${{ world }}");
    expect(result).toBe("hello world world");
  });

  test("When replacing string when 0 match", () => {
    const replacer = new StringReplacer({ world: "world" });
    const result = replacer.replaceString("hello");
    expect(result).toBe("hello");
  });

  test("When replacing string when 0 match", () => {
    const replacer = new StringReplacer({ world: "world" });
    const result = replacer.replaceString("hello ${{ world1 }}");
    expect(result).toBe("hello ");
  });

  test("When replacing string with complex map", () => {
    const replacer = new StringReplacer({
      world: "world",
      birthday: 2,
      isPrivate: true,
    });
    const result = replacer.replaceString(
      "hello ${{ world }} happy ${{birthday}} and ${{isPrivate}}"
    );
    expect(result).toBe("hello world happy 2 and true");
  });

  test("When replacing object", () => {
    const replacer = new StringReplacer({ world: "world" });
    const result = replacer.replaceObject({ hello: "${{ world }}" });
    expect(result).toStrictEqual({ hello: "world" });
  });

  test("When replacing nesting object", () => {
    const replacer = new StringReplacer({ world: "world" });
    const result = replacer.replaceObject({ hello: { world: "${{ world }}" } });
    expect(result).toStrictEqual({ hello: { world: "world" } });
  });

  test("When replacing object no match", () => {
    const replacer = new StringReplacer({ world: "world" });
    const result = replacer.replaceObject({ hello: "${{ world1 }}" });
    expect(result).toStrictEqual({ hello: "" });
  });
});
