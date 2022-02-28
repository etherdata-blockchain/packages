import { schema } from "@etherdata-blockchain/storage-model";
import { configs, enums, interfaces } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";

/**
 * Docker image db plugin
 */
export class DockerImageService extends BaseMongoDBService<schema.IDockerImage> {
  serviceName = enums.DBServiceName.dockerImage;
  protected model: Model<schema.IDockerImage> = schema.DockerImageModel;

  /**
   * Will delete corresponding update-script script
   * @param data
   */
  async delete(id: any) {
    const deletePromise = schema.UpdateScriptModel.updateOne(
      { "imageStacks.image": id },
      { $pull: { imageStacks: { image: id } } }
    ).exec();

    const deletePromise2 = schema.UpdateScriptModel.updateOne(
      { "containerStacks.image.image": id },
      { $unset: { "containerStacks.$.image": 0 } }
    ).exec();
    await Promise.all([deletePromise, deletePromise2]);
    return super.delete(id);
  }

  /**
   * Create data with webhook data from docker hub
   * @param {DockerWebhookInterface} data data from webhook
   */
  async createWithDockerWebhookData(
    data: interfaces.DockerWebhookInterface
  ): Promise<void> {
    if (data.push_data?.tag?.length === 0) {
      return;
    }

    const dockerData = {
      imageName: data.repository.repo_name,
      tags: [{ tag: data.push_data.tag }],
      selectedTag: undefined,
      selected: false,
    };

    const prevImage = await this.model
      .findOne({ imageName: data.repository.repo_name })
      .exec();
    if (prevImage) {
      await this.model.updateOne(
        {
          imageName: data.repository.repo_name,
          "tags.tag": { $ne: data.push_data.tag },
        },
        { $push: { tags: { tag: data.push_data.tag } } }
      );
    } else {
      await this.model.create(dockerData);
    }
  }

  /**
   * Search docker images by image name
   * @param{string} key
   */
  async search(key: string): Promise<schema.IDockerImage[]> {
    const query = this.model
      .find({ imageName: { $regex: ".*" + key + ".*" } })
      .limit(configs.Configurations.numberPerPage);
    return query.exec();
  }
}
