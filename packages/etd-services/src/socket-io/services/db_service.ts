/**
 * App plugin for app use
 */

import { configs, enums } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { BaseSocketIOService } from "../socket_io_service";
import { PendingJobService } from "../../mongodb/services/job/pending_job_service";
import { ClientService } from "./client_service";
import { DeviceRegistrationService } from "../../mongodb/services/device/device_registration_service";
import { JobResultService } from "../../mongodb/services/job/job_result_service";
import { ExecutionPlanService, StorageManagementService } from "../../mongodb";
import Logger from "@etherdata-blockchain/logger";

/**
 * Watch for database changes
 */
export class DBChangeService extends BaseSocketIOService {
  serviceName = enums.SocketIOServiceName.dbChange;

  // eslint-disable-next-line require-jsdoc
  constructor() {
    super();
    this.watchJobChanges();
    this.periodicJobs = [
      {
        interval: 120,
        job: this.periodicRemoveJobsAndResponses.bind(this),
        name: "periodic_device_data",
      },
      {
        interval: 10,
        job: this.periodicSendOnlineCount.bind(this),
        name: "periodic_send_online_count",
      },
    ];
  }

  /**
   * Periodic send latest online devices number
   */
  async periodicSendOnlineCount() {
    const clientPlugin = this.findService<ClientService>(
      enums.SocketIOServiceName.client
    );
    const plugin = new DeviceRegistrationService();
    const storage = new StorageManagementService();

    const onlineCount = await plugin.getOnlineDevicesCount();
    const totalCount = await storage.count();
    clientPlugin?.server?.emit(enums.SocketIOEvents.latestInfo, {
      totalCount,
      onlineCount,
    });
  }

  /**
   * Watch for collection's changes
   */
  watchJobChanges() {
    schema.JobResultModel.watch([], { fullDocument: "updateLookup" }).on(
      "change",
      async (data) => {
        const clientPlugin = this.findService<ClientService>(
          enums.SocketIOServiceName.client
        );
        switch (data.operationType) {
          case "insert":
            const result = data.fullDocument!;
            if (result.success) {
              switch (result.commandType) {
                case enums.JobTaskType.Docker:
                  clientPlugin?.server
                    ?.in(result.from)
                    .emit(
                      `${enums.SocketIOEvents.dockerResult}-${result.jobId}`,
                      result.result
                    );
                  break;

                case enums.JobTaskType.Web3:
                  clientPlugin?.server
                    ?.in(result.from)
                    .emit(
                      `${enums.SocketIOEvents.rpcResult}-${result.jobId}`,
                      result.result
                    );
                  break;
              }
            } else {
              switch (result.commandType) {
                case enums.JobTaskType.Docker:
                  clientPlugin?.server
                    ?.in(result.from)
                    .emit(
                      `${enums.SocketIOEvents.dockerError}-${result.jobId}`,
                      result.result
                    );
                  break;
                case enums.JobTaskType.Web3:
                  clientPlugin?.server
                    ?.in(result.from)
                    .emit(
                      `${enums.SocketIOEvents.rpcError}-${result.jobId}`,
                      result.result
                    );
                  break;
              }
            }
            // await JobResultModel.deleteOne({ _id: result._id });

            break;
        }
      }
    );

    schema.DeviceModel.watch([], { fullDocument: "updateLookup" }).on(
      "change",
      (data) => {
        const clientPlugin = this.findService<ClientService>(
          enums.SocketIOServiceName.client
        );
        switch (data.operationType) {
          case "insert":
            console.log("Inserting");
            break;

          case "update":
            clientPlugin?.server
              ?.in(data.fullDocument?.id)
              .emit(enums.SocketIOEvents.detailInfo, data.fullDocument);
            break;
          default:
            break;
        }
      }
    );

    schema.PendingJobModel.watch([], { fullDocument: "updateLookup" }).on(
      "change",
      async (data) => {
        const clientPlugin = this.findService<ClientService>(
          enums.SocketIOServiceName.client
        );
        if (
          data.operationType === "insert" ||
          data.operationType === "delete"
        ) {
          const totalNumber = await schema.PendingJobModel.countDocuments();
          clientPlugin?.server?.emit(
            enums.SocketIOEvents.pendingJob,
            totalNumber
          );
        }
      }
    );

    schema.ExecutionPlanModel.watch<schema.IExecutionPlan>([], {
      fullDocument: "updateLookup",
    }).on("change", async (data) => {
      const clientService = this.findService<ClientService>(
        enums.SocketIOServiceName.client
      );
      if (data.operationType === "insert" || data.operationType === "delete") {
        //@ts-ignore
        const updateTemplateId = data.fullDocument?.updateTemplate;
        if (updateTemplateId) {
          clientService?.server
            ?.in(`${updateTemplateId}`)
            .emit(enums.SocketIOEvents.executionPlan, "update");
        }
      }
    });
  }

  /**
   * Periodic remove jobs from db
   */
  async periodicRemoveJobsAndResponses() {
    const jobPlugin = new PendingJobService();
    const jobResultPlugin = new JobResultService();
    const maximumDuration = configs.Configurations.maximumNotSeenDuration;
    await jobPlugin.removeOutdatedJobs(maximumDuration);
    await jobResultPlugin.removeOutdatedJobs(maximumDuration);
  }
}
