import { schema } from "@etherdata-blockchain/storage-model";
import { enums } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";
import moment from "moment";

/**
 * Plugin for pending job
 */
export class PendingJobService extends BaseMongoDBService<
  schema.IPendingJob<enums.AnyValueType>
> {
  serviceName = enums.DBServiceName.pendingJob;
  protected model: Model<schema.IPendingJob<enums.AnyValueType>> =
    schema.PendingJobModel;

  /**
   * Get a job and update the retrieved field to true.
   * Will only return the job with retrieved false
   * @param deviceID
   */
  async getJob<T extends enums.PendingJobTaskType>(
    deviceID: string
  ): Promise<schema.IPendingJob<T> | undefined> {
    const result = await this.model.findOneAndUpdate(
      {
        targetDeviceId: deviceID,
        retrieved: false,
      },
      {
        retrieved: true,
      },
      { sort: { time: 1 } }
    );

    if (result === null) {
      return undefined;
    }

    //@ts-ignore
    return result;
  }

  /**
   * Will return total number of pending jobs based on the query
   */
  async getNumberOfNotRetrievedJobs(query: { [key: string]: any }) {
    query.retrieved = false;
    return this.model.countDocuments(query);
  }

  /**
   * Insert many jobs
   * @param jobs
   */
  async insertMany(jobs: schema.IPendingJob<enums.AnyValueType>[]) {
    await this.model.insertMany(jobs);
  }

  /**
   * Remove outdated jobs
   * @param maximumDuration In seconds
   */
  async removeOutdatedJobs(maximumDuration: number) {
    const deadline = moment().subtract(maximumDuration, "seconds");
    await this.model.deleteMany({ updatedAt: { $lte: deadline.toDate() } });
  }
}
