export interface DockerImageDBInterface extends Document {
  imageName: string;
  tags: DockerImageVersionDBInterface[];
  /**
   * Will be set when query from installation template
   */
  tag?: DockerImageVersionDBInterface;
}

interface DockerImageVersionDBInterface extends Document {
  tag: string;
}
