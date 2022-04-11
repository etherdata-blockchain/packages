import urlJoin from "../index";

describe("Given a url join function", () => {
  test("When join on single parameter", () => {
    const result = urlJoin("https://abc.com");
    expect(result).toBe("https://abc.com");
  });

  test("When join on single parameter", () => {
    const result = urlJoin();
    expect(result).toBe("");
  });

  test("When join on invalid types", () => {
    //@ts-ignore
    expect(() => urlJoin("https://abc.com", true)).toThrow(TypeError);
  });

  test("When given a single correct url", () => {
    const result = urlJoin("https://abc.com", "abc");
    expect(result).toBe("https://abc.com/abc");
  });

  test("When given a correct url", () => {
    const result = urlJoin("https://abc.com", "/abc");
    expect(result).toBe("https://abc.com/abc");
  });

  test("When given a correct url", () => {
    const result = urlJoin("https://abc.com", "/abc/");
    expect(result).toBe("https://abc.com/abc/");
  });

  test("When given a correct url", () => {
    const result = urlJoin("https://abc.com", "/abc/cde/def");
    expect(result).toBe("https://abc.com/abc/cde/def");
  });

  test("When given a correct url", () => {
    const result = urlJoin("https:", "/abc/cde/def");
    expect(result).toBe("https://abc/cde/def");
  });

  test("When given a correct url", () => {
    const result = urlJoin("https:/", "/abc/cde/def");
    expect(result).toBe("https://abc/cde/def");
  });

  test("When given a correct url", () => {
    const result = urlJoin("https:/", "/abc/cde/def", "");
    expect(result).toBe("https://abc/cde/def");
  });

  test("When given a correct url", () => {
    const result = urlJoin("https:/", "/abc", "", "/cde", "def");
    expect(result).toBe("https://abc/cde/def");
  });

  test("When given a correct url with an empty part", () => {
    const result = urlJoin("https:/", "", "/abc/cde");
    expect(result).toBe("https://abc/cde");
  });

  test("When given a correct file url", () => {
    const result = urlJoin("file:///", "", "/abc/cde");
    expect(result).toBe("file:///abc/cde");
  });
});
