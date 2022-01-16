import { newObjectId } from "../../utils";
import ObjectID from "bson-objectid";

describe("Given a mongodb utils", () => {
  test("When calling create a object id", () => {
    const result = newObjectId();
    expect(result).toBeDefined();
  });

  test("When calling create a object id with given string", () => {
    const id = new ObjectID();
    const result = newObjectId(id.toHexString());
    expect(`${result}`).toBe(id.toHexString());
  });
});
