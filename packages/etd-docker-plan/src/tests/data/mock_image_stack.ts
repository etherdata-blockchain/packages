import { interfaces } from "@etherdata-blockchain/common";

type ImageStack = interfaces.db.ImageStack;

export const MockImageStacks: ImageStack[] = [
  {
    image: "test/test",
    tag: "latest",
  },
  {
    image: "test/test",
    tag: "1.0",
  },
  {
    image: "test/test1",
    tag: "latest",
  },
  {
    image: "test/test1",
    tag: "1.0",
  },
  {
    image: "test/test1",
    tag: "1.1",
  },
];

export const MockImageId = "mock_image_id";
