export interface DockerImageDBInterface {
  imageName: string;
  tags: DockerImageVersionDBInterface[];
  /**
   * Will be set when query from installation template
   */
  tag?: DockerImageVersionDBInterface;
}

interface DockerImageVersionDBInterface {
  tag: string;
}
