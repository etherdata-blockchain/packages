/**
 * This template is used to generate a docker-compose file
 */
import { DockerImageDBInterface } from "./docker_interfaces";

export interface InstallationTemplateDBInterface {
  /**
   * Docker compose version
   */
  version: string;
  /**
   * Docker compose services. This should be the same format as the docker compose file
   */
  services: { name: string; service: InstallationTemplateServiceDBInterface }[];
  /**
   * Template tag used to identify the template
   */
  // eslint-disable-next-line camelcase
  template_tag: string;
  /**
   * Author of this installation template. Will be set on server.
   */
  // eslint-disable-next-line camelcase
  created_by: string;
}

export interface InstallationTemplateServiceDBInterface {
  /**
   * Docker Image of this service
   */
  image: DockerImageDBInterface;
  /**
   * Restart policy
   */
  restart: string;
  /**
   * Environments used in the docker compose. For example a=hello
   */
  environment: string[];
  /**
   * Network mode
   */
  // eslint-disable-next-line camelcase
  network_mode: string;
  /**
   * Mounting options. For example ./data:/var/usr
   */
  volumes: string[];
  /**
   * Labels of the docker compose
   */
  labels: string[];
}
