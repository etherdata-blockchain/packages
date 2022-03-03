import * as tsj from "ts-json-schema-generator";
import fs from "fs";
import glob from "glob";
import * as path from "path";
import Logger from "@etherdata-blockchain/logger";

async function getInterfaceFileNames(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob("src/interfaces/**/*.ts", (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
}

async function getSchema() {
  const filenames = await getInterfaceFileNames();
  for (const filename of filenames) {
    if (filename.includes("index")) {
      continue;
    }
    const config = {
      path: filename,
      type: "*",
    };
    Logger.info(`Processing ${filename}`);
    try {
      const schema = tsj.createGenerator(config).createSchema(config.type);
      const outputFileName = path.join(
        "src/schemas",
        `${path.parse(filename).name}.json`
      );
      fs.writeFileSync(outputFileName, JSON.stringify(schema, null, 4));
    } catch (e) {
      Logger.error(`${filename}: ${e}`);
    }
  }
}

(async () => {
  await getSchema();
})();
