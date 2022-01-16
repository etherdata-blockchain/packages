import { schema } from "@etherdata-blockchain/storage-model";
import { enums } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";
import moment from "moment";

// eslint-disable-next-line require-jsdoc
export class JobResultService extends BaseMongoDBService<schema.IJobResult> {
  serviceName = enums.DBServiceName.jobResult;
  protected model: Model<schema.IJobResult> = schema.JobResultModel;

  /**
   * Get results
   * @param from User ID
   */
  async getResults(from: string): Promise<schema.IJobResult[] | undefined> {
    const result = await this.model.find({ from: from });
    await this.model.remove({ from: from });

    if (result === null) {
      return undefined;
    }
    return result;
  }

  /**
   * Remove outdated jobs
   * @param maximumDuration In seconds
   */
  async removeOutdatedJobs(maximumDuration: number) {
    const deadline = moment().subtract(maximumDuration, "seconds");
    await this.model.deleteMany({ time: { $lte: deadline.toDate() } });
  }
}
