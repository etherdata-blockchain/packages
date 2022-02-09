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
    return await this.model.exists({ qr_code: deviceID });
  }

  /**
   * Search items by key
   * @param key
   */
  async search(key: string): Promise<schema.IStorageItem[]> {
    const query = this.model
      .find({
        $or: [{ qr_code: { $regex: ".*" + key + ".*" } }],
      })
      .limit(configs.Configurations.numberPerPage);
    return query.exec();
  }
}
