/**
 * This template is used to generate a docker-compose file
 */
import { DockerImageDBInterface } from "./docker_interfaces";

export interface InstallationTemplateDBInterface {
  version: string;
  services: { name: string; service: InstallationTemplateServiceDBInterface }[];
  /**
   * Template tag used to identify the template
   */
  // eslint-disable-next-line camelcase
  template_tag: string;
  // eslint-disable-next-line camelcase
  created_by: string;
}

export interface InstallationTemplateServiceDBInterface {
  image: DockerImageDBInterface;
  restart: string;
  environment: string[];
  // eslint-disable-next-line camelcase
  network_mode: string;
  volumes: string[];
  labels: string[];
}
