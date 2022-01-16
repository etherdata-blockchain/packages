import { newObjectId } from "../../utils";
import { ObjectId } from "mongodb";

describe("Given a mongodb utils", () => {
  test("When calling create a object id", () => {
    const result = newObjectId();
    expect(result).toBeDefined();
  });

  test("When calling create a object id with given string", () => {
    const id = new ObjectId();
    const result = newObjectId(id.toHexString());
    expect(`${result}`).toBe(id.toHexString());
  });
});
