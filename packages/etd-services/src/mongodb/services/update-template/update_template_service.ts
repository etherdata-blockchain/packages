import { schema } from "@etherdata-blockchain/storage-model";
import { enums, interfaces, utils } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";

// eslint-disable-next-line require-jsdoc
export class UpdateTemplateService extends BaseMongoDBService<schema.IUpdateTemplate> {
  serviceName = enums.DBServiceName.updateScript;
  protected model: Model<schema.IUpdateTemplate> = schema.UpdateScriptModel;

  /**
   * Will replace docker image tag id by real docker image.
   * Will return undefined when there is no such image
   */
  async getUpdateTemplateWithDockerImage(
    id: string
  ): Promise<
    interfaces.db.UpdateTemplateWithDockerImageDBInterface | undefined
  > {
    const pipeline: any[] = [
      {
        $match: {
          _id: utils.newObjectId(id),
        },
      },
      {
        $unwind: {
          path: "$imageStacks",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$containerStacks",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "dockerimages",
          localField: "imageStacks.image",
          foreignField: "_id",
          as: "image",
        },
      },
      {
        $lookup: {
          from: "dockerimages",
          localField: "containerStacks.image.image",
          foreignField: "_id",
          as: "container",
        },
      },
      {
        $unwind: {
          path: "$container",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$container.tags",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$image",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$image.tags",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              $expr: {
                $eq: ["$containerStacks.image.tag", "$container.tags._id"],
              },
            },
            { imageStacks: { $exists: false } },
          ],
        },
      },
      {
        $match: {
          $expr: {
            $eq: ["$imageStacks.tag", "$image.tags._id"],
          },
        },
      },
      {
        $project: {
          image: 1,
          container: 1,
          containerStacks: 1,
          targetDeviceIds: 1,
          targetGroupIds: 1,
          name: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          targetDeviceIds: { $first: "$targetDeviceIds" },
          targetGroupIds: { $first: "$targetGroupIds" },
          containerStacks: {
            $push: {
              $mergeObjects: [
                "$containerStacks",
                {
                  image: "$container",
                },
              ],
            },
          },
          imageStacks: {
            $push: "$image",
          },
        },
      },
    ];
    const result = this.model.aggregate(pipeline);
    const template = await result.exec();
    if (template.length === 0) {
      // @ts-ignore
      return await this.get(id);
    }
    return template[0];
  }
}
