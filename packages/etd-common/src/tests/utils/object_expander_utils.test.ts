import { objectExpand } from "../../utils";

describe("Given a object expander", () => {
  test("When calling expand with a simple object", () => {
    const object = {
      name: "abc",
      data: {
        age: 30,
        weight: 30,
      },
    };

    const values = objectExpand(object, []);
    expect(values.length).toBe(3);
  });

  test("When calling expand with a nested object", () => {
    const object = {
      name: "abc",
      data: {
        age: 30,
        weight: 30,
        home: {
          city: "mock_city",
        },
      },
    };

    let values = objectExpand(object, []);
    expect(values.length).toBe(4);
  });

  test("When calling expand with a nested object and omit keys", () => {
    const object = {
      name: "abc",
      data: {
        age: 30,
        weight: 30,
        home: {
          city: "mock_city",
          street: "mock_street",
        },
      },
    };

    const values = objectExpand(object, ["city"]);
    expect(values.length).toBe(4);
  });
});
