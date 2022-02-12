/**
 * List of socket io events
 */
export enum SocketIOEvents {
  detailInfo = "detail-info",
  latestInfo = "latest-info",
  //docker
  dockerError = "docker-error",
  dockerResult = "docker-result",
  dockerCommand = "docker-command",
  //rpc
  rpcCommand = "rpc-command",
  rpcResult = "rpc-result",
  rpcError = "rpc-error",
  //pending job
  pendingJob = "pending-job",
  /**
   * When client wants to receive the latest info from device
   */
  joinRoom = "join-room",
  /**
   * When client doesn't want to receive the latest info
   */
  leaveRoom = "leave-room",
  // execution plan
  /**
   * New execution plan has an update
   */
  executionPlan = "execution-plan",
}
