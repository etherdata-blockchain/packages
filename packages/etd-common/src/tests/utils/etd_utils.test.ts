import { weiToETD } from "../../utils";

describe("Given a etd utils", () => {
  test("When calling weiToETD on a string", () => {
    const result = weiToETD("10000");
    expect(result).toBe("0.00000000000001");
  });

  test("When calling weiToETD on a number", () => {
    const result = weiToETD(10000);
    expect(result).toBe("0.00000000000001");
  });

  test("When calling weiToETD on an object", () => {
    const result = weiToETD({ high: "10000" });
    expect(result).toBe("0.00000000000001");
  });

  test("When calling weiToETD on a boolean value", () => {
    const result = weiToETD({ high: "false" });
    expect(result).toBe(0);
  });
});
