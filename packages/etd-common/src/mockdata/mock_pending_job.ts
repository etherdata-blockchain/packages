import { MockDeviceID, MockDeviceID2 } from "./mock_storage_item";
import { ObjectId } from "bson";
import { JobTaskType } from "../enums";

export const MockUpdateTemplate = new ObjectId();

export const MockPendingJob = {
  targetDeviceId: MockDeviceID,
  task: {
    type: JobTaskType.Web3,
    value: "",
  },
  from: "mock_from",
};

export const MockPendingJob2 = {
  targetDeviceId: MockDeviceID2,
  task: {
    type: JobTaskType.Web3,
    value: "",
  },
  from: "mock_from",
};

export const MockPendingUpdateTemplateJob = {
  targetDeviceId: MockDeviceID,
  task: {
    type: JobTaskType.UpdateTemplate,
    value: MockUpdateTemplate,
  },
  from: "mock_from",
};

export const MockPendingUpdateTemplate2Job = {
  targetDeviceId: MockDeviceID2,
  task: {
    type: JobTaskType.UpdateTemplate,
    value: MockUpdateTemplate,
  },
  from: "mock_from",
};
