import { MockDeviceID, MockDeviceID2 } from "./mock_storage_item";
import { ObjectId } from "bson";
import { JobTaskType, UpdateTemplateValueType } from "../enums";
import { PendingJobDBInterface } from "../interfaces/db-interfaces";

export const MockUpdateTemplate = new ObjectId();

export const MockUpdateTemplate2 = new ObjectId();

export const MockPendingJob: PendingJobDBInterface<UpdateTemplateValueType> = {
  createdAt: "",
  retrieved: true,
  targetDeviceId: MockDeviceID,
  task: {
    type: JobTaskType.Web3,
    value: {
      templateId: "",
    },
  },
  from: "mock_from",
  tries: 0,
};

export const MockPendingJob2: PendingJobDBInterface<UpdateTemplateValueType> = {
  createdAt: "",
  retrieved: false,
  targetDeviceId: MockDeviceID2,
  task: {
    type: JobTaskType.Web3,
    value: {
      templateId: "",
    },
  },
  from: "mock_from",
  tries: 0,
};

export const MockPendingUpdateTemplateJob: PendingJobDBInterface<UpdateTemplateValueType> =
  {
    createdAt: "",
    retrieved: false,
    targetDeviceId: MockDeviceID,
    task: {
      type: JobTaskType.UpdateTemplate,
      value: {
        templateId: MockUpdateTemplate.toHexString(),
      },
    },
    from: "mock_from",
    tries: 0,
  };

export const MockPendingUpdateTemplate2Job: PendingJobDBInterface<UpdateTemplateValueType> =
  {
    createdAt: "",
    retrieved: false,
    targetDeviceId: MockDeviceID2,
    task: {
      type: JobTaskType.UpdateTemplate,
      value: {
        templateId: MockUpdateTemplate.toHexString(),
      },
    },
    from: "mock_from",
    tries: 0,
  };
