/**
 * Types of job can be run
 */
export enum JobTaskType {
  /**
   * Docker task
   */
  // eslint-disable-next-line no-unused-vars
  Docker = "docker",
  /**
   * Rpc command task
   */
  // eslint-disable-next-line no-unused-vars
  Web3 = "web3",
  /**
   * Update template task
   */
  // eslint-disable-next-line no-unused-vars
  UpdateTemplate = "update-template",
}

export interface UpdateTemplateValueType {
  templateId: string;
}

export interface Web3ValueType {
  method: string;
  params: string[];
}

export type AnyValueType = {};

export type PendingJobTaskType =
  | AnyValueType
  | UpdateTemplateValueType
  | Web3ValueType;
