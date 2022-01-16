/**
 * List of plugin names
 */
export enum DBServiceName {
  deviceRegistration = "device-registration",
  transaction = "transaction",
  pendingJob = "pending-job",
  jobResult = "job-result",
  staticNode = "static-node",
  dockerImage = "docker-image",
  installScript = "install-script",
  storageItem = "storage-item",
  storageOwner = "storage-owner",
  updateScript = "update-script",
  executionPlan = "execution-plan",
}

export enum SocketIOServiceName {
  node = "node",
  app = "app",
  client = "client",
  dbChange = "dbChange",
}
