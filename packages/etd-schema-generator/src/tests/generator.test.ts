import { SchemaGenerator } from "../generator";
import fs from "fs";
import * as tsj from "ts-json-schema-generator";
import glob from "glob";

jest.mock("fs");
jest.mock("ts-json-schema-generator", () => ({
  createGenerator: jest.fn().mockReturnValue({
    createSchema: jest.fn(),
  }),
}));
jest.mock("glob", () =>
  jest.fn((path: string, callback: (err: any, files: string[]) => void) => {
    callback(undefined, ["a.ts", "b.ts", "c.ts"]);
  })
);

describe("Given a generator", () => {
  let generator: SchemaGenerator;

  beforeEach(() => {
    (fs.mkdirSync as any).mockClear();
    (fs.writeFileSync as any).mockClear();
    generator = new SchemaGenerator();
  });

  test("When generating schema without exiting folder", async () => {
    (fs.existsSync as any).mockReturnValue(false);
    await generator.getSchema("*.ts", "folder");
    expect(fs.mkdirSync).toBeCalledTimes(1);
    expect(fs.mkdirSync).toBeCalledWith("folder", { recursive: true });
    expect(fs.writeFileSync).toBeCalledTimes(3);
  });

  test("When generating schema with exiting folder", async () => {
    (fs.existsSync as any).mockReturnValue(true);
    await generator.getSchema("*.ts", "folder");
    expect(fs.mkdirSync).toBeCalledTimes(0);
    expect(fs.writeFileSync).toBeCalledTimes(3);
  });

  test("When generating schema with filter", async () => {
    (fs.existsSync as any).mockReturnValue(false);
    await generator.getSchema(
      "*.ts",
      "folder",
      (filename) => filename !== "b.ts"
    );
    expect(fs.mkdirSync).toBeCalledWith("folder", { recursive: true });
    expect(fs.writeFileSync).toBeCalledTimes(2);
  });

  test("When generating schema with custom naming", async () => {
    (fs.existsSync as any).mockReturnValue(false);
    await generator.getSchema(
      "*.ts",
      "folder",
      undefined,
      (recommendFileName) => "a.ts"
    );
    expect(fs.mkdirSync).toBeCalledWith("folder", { recursive: true });
    expect(fs.writeFileSync).toBeCalledTimes(3);
    expect(fs.writeFileSync).toBeCalledWith("a.ts", undefined);
  });
});
