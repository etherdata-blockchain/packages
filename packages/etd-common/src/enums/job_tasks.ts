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
  coinbase?: string;
}

export interface Web3ValueType {
  method: string;
  params: string[];
}

export type DockerValueType =
  | {
      method: "removeVolume";
      /**
       * Volume name
       */
      value: string;
    }
  | {
      /**
       * Stop docker container
       */
      method: "stopContainer";
      /**
       * Container id
       */
      value: string;
    }
  | {
      /**
       * Remove container
       */
      method: "removeContainer";
      /**
       * Container Id
       */
      value: string;
    }
  | {
      /**
       * Remove image
       */
      method: "removeImage";
      /**
       * Image id
       */
      value: string;
    }
  | {
      /**
       * Get container's log
       */
      method: "logs";
      /**
       * Container id
       */
      value: string;
    };

export type AnyValueType = {};

export type PendingJobTaskType =
  | AnyValueType
  | UpdateTemplateValueType
  | Web3ValueType
  | DockerValueType;
