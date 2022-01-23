import { Image } from "../../internal/stack/image";
import { MockImageStacks } from "../data/mock_image_stack";

describe("Given an image object", () => {
  test("When no image before", () => {
    const image = new Image([]);
    image.update(MockImageStacks[0]);
    expect(image.images[0]).toStrictEqual(MockImageStacks[0]);
  });

  test("When there is one image and update", () => {
    const image = new Image([MockImageStacks[0]]);
    image.update(MockImageStacks[1]);
    expect(image.images[0]).toStrictEqual(MockImageStacks[1]);
  });

  test("When there is one image and push", () => {
    const image = new Image([MockImageStacks[0]]);
    image.update(MockImageStacks[2]);
    expect(image.images[0]).toStrictEqual(MockImageStacks[0]);
    expect(image.images[1]).toStrictEqual(MockImageStacks[2]);
    expect(image.images.length).toBe(2);

    expect(image.imagesRemoved.length).toBe(0);
  });

  test("When multiple update occurs", () => {
    const image = new Image([MockImageStacks[2]]);
    image.update(MockImageStacks[3]);
    image.update(MockImageStacks[4]);
    expect(image.imagesRemoved.length).toBe(1);
    expect(image.images.length).toBe(1);

    expect(image.imagesRemoved[0]).toStrictEqual(MockImageStacks[2]);
    expect(image.images[0]).toStrictEqual(MockImageStacks[4]);
  });

  test("When no image and multiple updates", () => {
    const image = new Image([]);
    MockImageStacks.forEach((i) => {
      image.update(i);
    });

    expect(image.images.length).toBe(2);
    expect(image.imagesRemoved.length).toBe(0);
  });

  test("When adding same image multiple times", () => {
    const image = new Image([MockImageStacks[0]]);
    image.update(MockImageStacks[0]);
    image.update(MockImageStacks[0]);
    image.update(MockImageStacks[0]);
    expect(image.images[0]).toStrictEqual(MockImageStacks[0]);
    expect(image.imagesRemoved.length).toBe(0);
  });

  test("When remove image", () => {
    const image = new Image([MockImageStacks[0], MockImageStacks[2]]);
    image.remove(MockImageStacks[2]);
    expect(image.imagesRemoved.length).toBe(1);
    expect(image.images.length).toBe(1);
    expect(image.images[0]).toStrictEqual(MockImageStacks[0]);
    expect(image.imagesRemoved[0]).toStrictEqual(MockImageStacks[2]);
  });
});
