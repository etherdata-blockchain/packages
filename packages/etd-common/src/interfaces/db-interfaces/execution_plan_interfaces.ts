export interface ExecutionPlanDBInterface {
  /**
   * Creation timestamp of the execution plan
   */
  createdAt: any;
  /**
   * Update template's id related to this execution plan
   */
  updateTemplate: any;
  /**
   * Is the execution finished?
   */
  isDone: boolean;
  /**
   * Does the execution plan contain any error?
   */
  isError: boolean;
  /**
   * Name of the execution plan
   */
  name: string;
  /**
   * Description of the execution plan
   */
  description: string;
}
