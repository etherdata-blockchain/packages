import { Logger } from "../logger";

describe("Given a logger", () => {
  test("When calling info", () => {
    Logger.info("msg");
  });

  test("When calling warning", () => {
    Logger.warning("msg");
  });

  test("When calling error", () => {
    Logger.error("msg");
  });
});
