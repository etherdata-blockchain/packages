import { BaseMongoDBService } from "../../db_service";
import { Model, Query } from "mongoose";
import axios, { AxiosError } from "axios";
import moment from "moment";
import jwt from "jsonwebtoken";
import { configs, enums, interfaces } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import Logger from "@etherdata-blockchain/logger";
import { StorageManagementService } from "./storage_management_item_service";

export interface VersionInfo {
  version: string;
  count: number;
}

/**
 * Device registration service will register,
 * update, and query the info of devices
 */
export class DeviceRegistrationService extends BaseMongoDBService<schema.IDevice> {
  serviceName: enums.DBServiceName = enums.DBServiceName.deviceRegistration;
  protected model: Model<schema.IDevice> = schema.DeviceModel;

  // eslint-disable-next-line require-jsdoc
  async performPatch(data: schema.IDevice): Promise<schema.IDevice> {
    //@ts-ignore
    return await this.model.findOneAndUpdate(
      { id: data.id },
      //@ts-ignore
      data,
      { upsert: true }
    );
  }

  /**
   * Authenticate user with storage server.
   * Return true if the user is registered in storage server.
   * If provided key, then will use that key for authorization
   * @param device
   * @param prevKey Previous assigned key
   * @return [is_authorized, auth_key]
   */
  async auth(
    device: string,
    prevKey: string | undefined
  ): Promise<[boolean, string | undefined]> {
    /// If no previous key
    if (!prevKey) {
      try {
        return await this.authFromDB(device);
      } catch (e) {
        /// Cannot connect to the db
        return [false, undefined];
      }
    } else {
      try {
        jwt.verify(
          prevKey,
          configs.Environments.ServerSideEnvironments.PUBLIC_SECRET
        );
        /// verified key
        const newKey = jwt.sign(
          { device },
          configs.Environments.ServerSideEnvironments.PUBLIC_SECRET,
          {
            expiresIn: 600,
          }
        );
        return [true, newKey];
      } catch (e) {
        /// Token is expired
        Logger.warning(`${device} key is expired. Re authenticate from DB`);
        try {
          return await this.authFromDB(device);
        } catch (e) {
          /// Cannot cannot to the db
          Logger.error(`${device} cannot auth due to ${e}`);
          return [false, undefined];
        }
      }
    }
  }

  /**
   * Register user with users
   * @param device
   * @param user
   *
   * @return [success, error]
   */
  async register(
    device: string,
    user: string
  ): Promise<[boolean, string | undefined]> {
    try {
      const path = "storage_management/user/register";
      const url = new URL(
        path,
        configs.Environments.ServerSideEnvironments.STORAGE_MANAGEMENT_URL
      );
      await axios.post(
        url.toString(),
        { user, device },
        {
          headers: {
            Authorization: `Bearer ${configs.Environments.ServerSideEnvironments.STORAGE_MANAGEMENT_API_TOKEN}`,
          },
        }
      );
      return [true, undefined];
    } catch (e) {
      console.log(e);
      return [false, (e as AxiosError).response?.data.err];
    }
  }

  /**
   * Get total number of online devices
   */
  async getOnlineDevicesCount(): Promise<number> {
    const time = moment().subtract(
      configs.Configurations.maximumNotSeenDuration,
      "seconds"
    );
    const query = this.model.find({
      lastSeen: { $gt: time.toDate() },
    });

    return query.count();
  }

  /**
   * Return the admin version distribution
   */
  async getListOfAdminVersions(): Promise<VersionInfo[]> {
    const pipeline = this.model.aggregate([
      {
        //@ts-ignore
        $group: {
          _id: "$adminVersion",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          version: "$_id",
          count: "$count",
        },
      },
      {
        $sort: {
          version: 1,
        },
      },
    ]);

    return pipeline.exec();
  }

  /**
   * Return a list of node's etd version
   */
  async getListOfNodeVersion(): Promise<VersionInfo[]> {
    const pipeline = this.model.aggregate([
      {
        // @ts-ignore
        $group: {
          _id: "$data.systemInfo.nodeVersion",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          version: "$_id",
          count: "$count",
        },
      },
      {
        $sort: {
          version: 1,
        },
      },
    ]);

    return await pipeline.exec();
  }

  /**
   * Get devices by miner address
   * @param miner
   * @param pageNumber
   * @param pageSize
   */
  async getDevicesByMiner(
    miner: string,
    pageNumber: number,
    pageSize: number
  ): Promise<interfaces.PaginationResult<schema.IDevice>> {
    const devices = this.model.find({ "data.miner": miner });
    return this.doPagination(devices as any, pageNumber, pageSize);
  }

  // eslint-disable-next-line require-jsdoc
  protected performGet(id: string): Query<schema.IDevice, schema.IDevice> {
    //@ts-ignore
    return this.model.findOne({ id: id });
  }

  /**
   * Authentication from db
   * @param device
   * @private
   */
  private async authFromDB(
    device: string
  ): Promise<[boolean, string | undefined]> {
    const storageManagementService = new StorageManagementService();
    const authorized = await storageManagementService.auth(device);

    if (authorized) {
      // Generate a key for next task
      const newKey = jwt.sign({ device }, process.env.PUBLIC_SECRET!, {
        expiresIn: 600,
      });
      return [true, newKey];
    } else {
      return [false, undefined];
    }
  }

  /**
   * Search devices matched using localIpAddress, remoteIpAddress
   * @param key
   */
  async search(key: string): Promise<schema.IDevice[]> {
    const query = this.model
      .find({
        $or: [
          { "networkSettings.localIpAddress": key },
          { "networkSettings.remoteIpAddress": key },
        ],
      })
      .limit(configs.Configurations.numberPerPage);
    return query.exec();
  }
}
