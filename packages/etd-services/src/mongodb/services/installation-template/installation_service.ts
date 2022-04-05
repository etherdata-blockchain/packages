import { schema } from "@etherdata-blockchain/storage-model";
import { enums, utils } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";
import Logger from "@etherdata-blockchain/logger";

/**
 * Installation template plugin
 */
export class InstallationService extends BaseMongoDBService<schema.IInstallationTemplate> {
  serviceName = enums.DBServiceName.installScript;
  protected model: Model<schema.IInstallationTemplate> =
    schema.InstallationTemplateModel;

  /**
   * Generate a docker-compose file based on the installation template
   * @param{IInstallationTemplate} installationTemplate
   * @return {string} generated docker compose file in yaml format
   */
  generateDockerComposeFile(
    installationTemplate: schema.IInstallationTemplate
  ): string {
    const deepCopiedTemplate = JSON.parse(
      JSON.stringify(utils.convertServicesListToMap(installationTemplate))
    );
    delete deepCopiedTemplate.created_by;
    delete deepCopiedTemplate.template_tag;
    delete deepCopiedTemplate.createdAt;
    delete deepCopiedTemplate.updatedAt;
    delete deepCopiedTemplate.__v;
    delete deepCopiedTemplate._id;
    delete deepCopiedTemplate.description;
    for (const [key, val] of Object.entries(deepCopiedTemplate.services)) {
      //@ts-ignore
      if (val.image.tag) {
        // @ts-ignore
        val.image = `${val.image.imageName}:${val.image?.tag.tag}`;
      } else {
        // @ts-ignore
        val.image = `${val.image.imageName}:latest`;
      }

      // @ts-ignore
      delete val._id;
      deepCopiedTemplate.services[key] = val;
    }
    return utils.yaml.stringify(deepCopiedTemplate);
  }

  /**
   * Generate an env file from envs.
   * For example, if an envs looks like this:
   * {name: "Hello", value: "123"},
   * then the generated content will be
   * name=Hello
   * value=123
   * @param{any} envs
   */
  generateEnvFile(envs: { [key: string]: any }): string {
    let content = "";
    for (const [key, value] of Object.entries(envs)) {
      content += `${key}=${value}\n`;
    }
    return content;
  }

  /**
   * Validate if image exist.
   * @param{IInstallationTemplate} data
   * @param{boolean} upsert
   */
  async createWithValidation(
    data: schema.IInstallationTemplate,
    { upsert }: { upsert: boolean }
  ): Promise<schema.IInstallationTemplate | undefined> {
    // @ts-ignore
    const imageIds = data.services.map((s) => s.service.image.tag);
    const foundIdsNumber = await schema.DockerImageModel.countDocuments({
      "tags._id": { $in: imageIds },
    }).exec();
    if (foundIdsNumber !== imageIds.length) {
      Logger.error("Some id doesn't exist");
      return undefined;
    }

    return super.create(data, { upsert });
  }

  /**
   * Get template with docker images.
   * This will turn a docker image version id into a docker image object
   * @param{string} id template id
   */
  async getTemplateWithDockerImages(
    id: string
  ): Promise<schema.IInstallationTemplate | undefined> {
    const pipeline: any[] = [
      { $match: { _id: utils.newObjectId(id) } },
      {
        $unwind: {
          path: "$services",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "dockerimages",
          localField: "services.service.image.image",
          foreignField: "_id",
          as: "image",
        },
      },
      {
        $addFields: {
          image: {
            $first: "$image",
          },
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
          $expr: {
            $eq: ["$services.service.image.tag", "$image.tags._id"],
          },
        },
      },
      {
        $addFields: {
          "image.tag": "$image.tags",
        },
      },
      {
        $addFields: {
          "services.service.image": "$image",
        },
      },
      {
        $unset: ["image", "services.service.image.tags"],
      },
      {
        $group: {
          _id: "$_id",
          services: {
            $push: "$services",
          },
          version: {
            $first: "$version",
          },
          created_by: {
            $first: "$created_by",
          },
          template_tag: {
            $first: "$template_tag",
          },
          description: {
            $first: "$description",
          },
        },
      },
    ];

    const query = this.model.aggregate(pipeline);
    const results: schema.IInstallationTemplate[] = await query.exec();
    if (results.length === 0) {
      // fallback to traditional get
      return this.get(id);
    }
    return results[0];
  }
}
