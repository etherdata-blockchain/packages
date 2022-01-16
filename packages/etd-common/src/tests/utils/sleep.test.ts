import { sleep } from "../../utils";

describe("When given a sleep function", () => {
  test("sleep", async () => {
    await sleep(1000);
  });
});
