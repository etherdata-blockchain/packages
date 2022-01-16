export interface JobResultDBInterface {
  jobId: string;
  time: Date;
  deviceID: string;
  /**
   * From which client. This will be the unique id
   */
  from: string;
  command: any;
  result: any;
  success: boolean;
  commandType: string;
}
