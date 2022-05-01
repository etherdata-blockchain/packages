/**
 * Storage management system plugin
 */
import { schema } from "@etherdata-blockchain/storage-model";
import { configs, enums, interfaces } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";

export class StorageManagementService extends BaseMongoDBService<schema.IStorageItem> {
  serviceName: enums.DBServiceName = enums.DBServiceName.storageItem;
  protected model: Model<schema.IStorageItem> = schema.StorageItemModel;

  /**
   * Get devices by user ID
   * @param{number} page current page number start from 1
   * @param{string} userID user's pk
   */
  async getDevicesByUser(
    page: number,
    userID?: string
  ): Promise<interfaces.PaginationResult<schema.IStorageItem>> {
    const query = () =>
      this.model.find({ owner_id: userID }).populate("deviceStatus");
    //@ts-ignore
    return this.doPagination(query, page, configs.Configurations.numberPerPage);
  }

  /**
   * Get device ids by given user.
   * This will not do the pagination by default since only id field will be return.
   * @param userID
   */
  async getDeviceIdsByUser(userID: string): Promise<string[]> {
    const result = await this.model
      .find({ owner_id: userID })
      .select("qr_code")
      .exec();
    return result.map((r) => r.qr_code);
  }

  /**
   * This method will update given devices' owner and also will
   * unset the owner field of all owner's owned devices.
   * @param userID Owner to be updated
   * @param deviceIds List of devices to be updated
   */
  async registerDevicesByUser(userID: string, deviceIds: string[]) {
    await this.model.updateMany({ qr_code: deviceIds }, { owner_id: userID });
  }

  /**
   * This method will unset the owner field of all owner's owned devices.
   * @param userID Owner to be updated
   */
  async unregisterDevicesByUser(userID: string) {
    await this.model.updateMany(
      { owner_id: userID },
      { $unset: { owner_id: 1 } }
    );
  }

  /**
   * Get device with status from database
   * @param deviceID
   */
  async getDeviceByID(deviceID: string): Promise<schema.IStorageItem> {
    const result = this.model
      .findOne({ qr_code: deviceID })
      .populate("deviceStatus");
    return (await result.exec()) as any;
  }

  /**
   * Return true if device exists in the database
   * @param deviceID
   */
  async auth(deviceID: string): Promise<boolean> {
    //@ts-ignore
    return this.model.exists({ qr_code: deviceID });
  }

  /**
   * Search devices matched using qr_code, localIpAddress, remoteIpAddress
   * @param key
   */
  async search(
    key: string
  ): Promise<interfaces.db.StorageItemWithStatusDBInterface[]> {
    const pipelines = [
      {
        $lookup: {
          from: `${enums.ModelName.device}s`,
          localField: "qr_code",
          foreignField: "id",
          as: "status",
        },
      },
      {
        $unwind: {
          path: "$status",
        },
      },
      {
        $match: {
          $or: [
            { "status.networkSettings.localIpAddress": key },
            { "status.networkSettings.remoteIpAddress": key },
            { qr_code: { $regex: ".*" + key + ".*" } },
          ],
        },
      },
    ];

    const query = this.model
      .aggregate(pipelines)
      .limit(configs.Configurations.numberPerPage);
    return query.exec();
  }
}
