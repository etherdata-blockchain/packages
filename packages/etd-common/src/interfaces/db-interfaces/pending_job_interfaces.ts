import { JobTaskType, PendingJobTaskType } from "../../enums";

interface Task<T extends PendingJobTaskType> {
  type: JobTaskType;
  value: T;
}

export interface PendingJobDBInterface<T> {
  targetDeviceId: string;
  /**
   * From client id.
   */
  from: string;
  task: Task<T>;
  createdAt: string;
  /**
   * Whether this job has been retrieved
   */
  retrieved: boolean;
  /**
   * Number of retires happened in the past
   */
  tries: number;
}
