import { abbreviateNumber } from "../../utils";

describe("Given a value formatter", () => {
  test("When calling value format", () => {
    const value = 1000000;
    const result = abbreviateNumber(value);
    expect(result).toBe("1.0M");
  });
});
