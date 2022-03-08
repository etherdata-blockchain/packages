import { JobTaskType, PendingJobTaskType } from "../../enums";

interface Task<T extends PendingJobTaskType> {
  /**
   * Job type
   */
  type: JobTaskType;
  /**
   * Job value
   */
  value: T;
}

export interface PendingJobDBInterface<T> {
  /**
   * Send this job to which device
   */
  targetDeviceId: string;
  /**
   * From client id.
   */
  from: string;
  /**
   * Task object
   */
  task: Task<T>;
  /**
   * Creation timestamp
   */
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
