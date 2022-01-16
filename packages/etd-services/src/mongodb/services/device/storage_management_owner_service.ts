import { schema } from "@etherdata-blockchain/storage-model";
import { configs, enums, interfaces } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";
import moment from "moment";

/**
 * Storage management system plugin
 */
export class StorageManagementOwnerService extends BaseMongoDBService<schema.IStorageOwner> {
  serviceName = enums.DBServiceName.storageOwner;
  protected model: Model<schema.IStorageOwner> = schema.StorageOwnerModel;

  /**
   * Get list of users with number of online devices count and total devices count
   * @param{number} page Current page
   */
  async getListOfUsers(
    page: number
  ): Promise<interfaces.PaginationResult<schema.IStorageOwner>> {
    const now = moment();
    const prev = now.subtract(configs.Configurations.maximumNotSeenDuration);
    const pipeline: any[] = [
      {
        $lookup: {
          from: "storage_management_item",
          localField: "user_id",
          foreignField: "owner_id",
          as: "devices",
        },
      },
      {
        $addFields: {
          totalCount: {
            $size: "$devices",
          },
        },
      },
      {
        $unwind: {
          path: "$devices",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "devices",
          localField: "devices.qr_code",
          foreignField: "id",
          as: "status",
        },
      },
      {
        $unwind: {
          path: "$status",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          count: {
            $cond: {
              if: {
                $gt: ["$status.lastSeen", prev.toDate()],
              },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          onlineCount: {
            $sum: "$count",
          },
          user_name: {
            $first: "$user_name",
          },
          user_id: {
            $first: "$user_id",
          },
          coinbase: {
            $first: "$coinbase",
          },
          totalCount: {
            $first: "$totalCount",
          },
        },
      },
    ];

    const aggregation = () =>
      this.model.aggregate(pipeline).sort({ user_id: 1 });
    const query: any = () => this.model.find();

    return this.doPaginationForAgg(
      aggregation,
      query,
      page,
      configs.Configurations.numberPerPage
    );
  }
}
