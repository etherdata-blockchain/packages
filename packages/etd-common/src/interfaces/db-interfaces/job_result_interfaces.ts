import { JobTaskType } from "../../enums";

export interface JobResultDBInterface {
  /**
   * Pending job's id
   */
  jobId: string;
  /**
   * Submission date
   */
  time: Date;
  /**
   * Submitted by which device
   */
  deviceID: string;
  /**
   * From which client who sent this job. This will be the unique id
   */
  from: string;
  /**
   * actual command
   */
  command: any;
  /**
   * Job's result
   */
  result: any;
  /**
   * Is success?
   */
  success: boolean;
  /**
   * Command type. Should be one of the job task type enum
   */
  commandType: JobTaskType;
}
