import { schema } from "@etherdata-blockchain/storage-model";
import { enums } from "@etherdata-blockchain/common";
import { Model } from "mongoose";
import { BaseMongoDBService } from "../../db_service";

/**
 * Execution plan plugin
 */
export class ExecutionPlanService extends BaseMongoDBService<schema.IExecutionPlan> {
  serviceName = enums.DBServiceName.executionPlan;
  protected model: Model<schema.IExecutionPlan> = schema.ExecutionPlanModel;

  /**
   * Get execution plans by update template
   * @param id
   */
  async getPlans(id: string): Promise<schema.IExecutionPlan[] | undefined> {
    const query = this.model
      .find({ updateTemplate: id })
      .sort({ timestamp: 1 });

    return query.exec();
  }

  /**
   * Delete Execution plans by update template id
   * @param id
   */
  async delete(id: any): Promise<any> {
    const query = this.model.deleteMany({ updateTemplate: id });
    await query.exec();
  }
}
