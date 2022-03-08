export interface DockerImageDBInterface {
  /**
   * Name of the docker image. For example hello-world
   */
  imageName: string;
  /**
   * List of tags of the given image. For example [latest, 1.0, 1.1]
   */
  tags: DockerImageVersionDBInterface[];
  /**
   * Read only! Will be set when query from installation template.
   */
  tag?: DockerImageVersionDBInterface;
}

interface DockerImageVersionDBInterface {
  /**
   * Tag of the image. For example 1.0
   */
  tag: string;
}

export interface DockerWebhookInterface {
  // eslint-disable-next-line camelcase
  callback_url: string;
  // eslint-disable-next-line camelcase
  push_data: PushData;
  repository: Repository;
}

interface PushData {
  images: string[];
  // eslint-disable-next-line camelcase
  pushed_at: number;
  pusher: string;
  tag: string;
}

interface Repository {
  // eslint-disable-next-line camelcase
  comment_count: number;
  // eslint-disable-next-line camelcase
  date_created: number;
  description: string;
  dockerfile: string;
  // eslint-disable-next-line camelcase
  full_description: string;
  // eslint-disable-next-line camelcase
  is_official: boolean;
  // eslint-disable-next-line camelcase
  is_private: boolean;
  // eslint-disable-next-line camelcase
  is_trusted: boolean;
  name: string;
  namespace: string;
  owner: string;
  // eslint-disable-next-line camelcase
  repo_name: string;
  // eslint-disable-next-line camelcase
  repo_url: string;
  // eslint-disable-next-line camelcase
  star_count: number;
  status: string;
}
