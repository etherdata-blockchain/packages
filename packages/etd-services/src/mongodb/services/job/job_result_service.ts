import { schema } from "@etherdata-blockchain/storage-model";
import { enums, interfaces, configs } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";
import moment from "moment";
import { PendingJobService } from "./pending_job_service";

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

  async submitResult(
    result: interfaces.db.JobResultDBInterface,
    pendingJob: interfaces.db.PendingJobDBInterface<any>
  ): Promise<{ success: boolean; reason?: string }> {
    try {
      const pendingJobService = new PendingJobService();
      if (pendingJob.tries > configs.Configurations.maximumRetiresAllowed - 1) {
        await pendingJobService.delete((pendingJob as any)._id);
        return { success: false, reason: "Tries exceeds the limit" };
      }
      if (!result.success) {
        // Delete the pending job if it exceeds the limit
        pendingJob.tries = pendingJob.tries + 1;
        await pendingJobService.patch(pendingJob as any);
        return { success: true };
      } else {
        await pendingJobService.delete((pendingJob as any)._id);
      }
      await this.patch(result as any);
      return { success: true };
    } catch (e) {
      return { success: false, reason: `${e}` };
    }
  }
}
