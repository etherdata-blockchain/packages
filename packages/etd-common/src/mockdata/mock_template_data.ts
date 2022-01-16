import { MockDockerImage, MockDockerImage3 } from "./mock_docker_data";

export const MockImageId = "mock_image_id";
export const MockTagId = "mock_tag_id";

export const MockDockerImageWithId = {
  _id: MockImageId,
  imageName: "test",
  tags: [{ tag: "v1.0", _id: MockTagId }],
  tag: { tag: "v1.0", _id: MockTagId },
};

export const MockInstallationTemplateData = {
  version: "3",
  services: [
    {
      name: "worker",
      service: {
        image: MockDockerImage,
        restart: "always",
        environment: [],
        volumes: [],
        labels: [],
      },
    },
  ],
  // eslint-disable-next-line camelcase
  template_tag: "test",
  // eslint-disable-next-line camelcase
  created_by: "",
};

export const MockInstallationTemplateDataWithId = {
  version: "3",
  services: [
    {
      name: "worker",
      service: {
        image: MockDockerImageWithId,
        restart: "always",
        environment: [],
        volumes: [],
        labels: [],
      },
    },
  ],
  // eslint-disable-next-line camelcase
  template_tag: "test",
  // eslint-disable-next-line camelcase
  created_by: "",
};

export const MockEmptyServiceTemplateData = {
  version: "3",
  services: [],
  // eslint-disable-next-line camelcase
  template_tag: "test",
  // eslint-disable-next-line camelcase
  created_by: "",
};

export const MockComplicatedTemplateData = {
  version: "3",
  services: [
    {
      name: "worker",
      service: {
        image: MockDockerImage,
        restart: "always",
        environment: [],
        volumes: [],
        labels: [],
      },
    },
    {
      name: "admin",
      service: {
        image: MockDockerImage3,
        restart: "always",
        environment: [],
        volumes: [],
        labels: [],
      },
    },
  ],
  // eslint-disable-next-line camelcase
  template_tag: "test",
  // eslint-disable-next-line camelcase
  created_by: "",
};

export const MockJSONSchemaFormInstallationTemplateData = {
  version: "3",
  services: [
    {
      name: "worker",
      service: {
        image: 0,
        restart: "always",
        environment: [],
        volumes: [],
        labels: [],
      },
    },
  ],
  // eslint-disable-next-line camelcase
  template_tag: "test",
  // eslint-disable-next-line camelcase
  created_by: "",
};
