import * as tsj from "ts-json-schema-generator";
import glob from "glob";
import Logger from "@etherdata-blockchain/logger";
import path from "path";
import fs from "fs";

/**
 * JSON schema generator
 */
export class SchemaGenerator {
  /**
   * Given file pattern, returns a list of file paths that matched
   * @param pattern
   */
  private async getInterfaceFileNames(pattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      glob(pattern, (err, files) => {
        if (err) {
          reject(err);
        }
        resolve(files);
      });
    });
  }

  /**
   * Create folder if not exists
   * @param folder
   * @private
   */
  private findAndCreateFolder(folder: string) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  /**
   * Given a file pattern, write list of json schema to files
   * @param pattern File pattern
   * @param outputFolder Output folder. Will create if not exist
   * @param filter File name filter. Skip files
   * @param filenameGenerator Get generated filename
   */
  async getSchema(
    pattern: string,
    outputFolder: string,
    filter?: (filename: string) => boolean,
    filenameGenerator?: (recommendFileName: string) => string
  ) {
    this.findAndCreateFolder(outputFolder);
    const filenames = await this.getInterfaceFileNames(pattern);
    for (const filename of filenames) {
      const notSkip = filter !== undefined ? filter(filename) : true;
      if (!notSkip) {
        continue;
      }

      const config = {
        path: filename,
        type: "*",
      };

      Logger.info(`Processing ${filename}`);
      try {
        const schema = tsj.createGenerator(config).createSchema(config.type);
        const recommendFileName = path.join(
          outputFolder,
          `${path.parse(filename).name}.json`
        );

        const outputFileName =
          filenameGenerator !== undefined
            ? filenameGenerator(recommendFileName)
            : recommendFileName;

        fs.writeFileSync(outputFileName, JSON.stringify(schema, null, 4));
      } catch (e) {
        Logger.error(`${filename}: ${e}`);
      }
    }
  }
}
