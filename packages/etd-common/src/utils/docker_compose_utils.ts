/**
 * convertServicesListToMap.
 * When we have a data from our json form, the services is a list.
 * However, we need services to be a map where key is the service name
 * and value is the actual script.
 *
 * **Example:**
 * ```javascript
 * {
 *     services: [
 *         {
 *             "name": "worker",
 *             "service": {
 *                 environments: []
 *             }
 *         }
 *     ]
 * }
 * ```
 * will become
 * ```javascript
 * {
 *     services: {
 *         "worker": {
 *            environments: []
 *         }
 *     }
 * }
 * ```
 * @param{any} data data from json schema form
 */
import {
  DockerImageDBInterface,
  InstallationTemplateDBInterface,
} from "../interfaces/db-interfaces";

export function convertServicesListToMap(data: {
  services: { name: string; service: any }[];
}): any {
  const services: { [key: string]: any } = {};
  for (const service of data.services) {
    services[service.name] = service.service;
  }
  const copied = JSON.parse(JSON.stringify(data));
  copied.services = services;
  return copied;
}

/**
 * Convert a {from, to} array to {from: to} Map based on targetKeys
 * @param data
 * @param targetKeys
 * @param root is Root?
 */
export function convertFromToArrayToMap(
  data: { [key: string]: any },
  targetKeys: string[],
  root = false
) {
  const deepCopied: { [key: string]: any } = root
    ? JSON.parse(JSON.stringify(data))
    : data;

  for (const [key, value] of Object.entries(deepCopied)) {
    if (targetKeys.includes(key)) {
      const newMap: { [key: string]: any } = {};
      for (const item of value) {
        newMap[item.from] = item.to;
      }
      deepCopied[key] = newMap;
      continue;
    }

    if (typeof value === "object") {
      convertFromToArrayToMap(value, targetKeys, false);
    }
  }
  return deepCopied;
}

/**
 * Expand image with tags
 * @param{IDockerImage[]} images
 * @return{any}
 */
export function expandImages(
  images: DockerImageDBInterface[]
): DockerImageDBInterface[] {
  const imageWithTags: any[] = [];
  for (const image of images) {
    // @ts-ignore
    if (image.tags.length === 0) {
      imageWithTags.push({ ...image, tags: [{ tag: "latest" }] });
    }
    // @ts-ignore
    for (const tag of image.tags) {
      imageWithTags.push({ ...image, tags: [tag] });
    }
  }
  return imageWithTags;
}

/**
 * Convert query data from database format to format that can be used to create a data
 **Example:**
 ```javascript
 {
    services: [
        {
            "name": "worker",
            "service": {
                image: '{
                    "_id": "id",
                    imageName: "abc",
                    "tag": {"_id": "id"}
                }'
            }
        }
    ]
}
 ```
 will become
 ```javascript
 {
    services: {
        "worker": {
           environments: []
           image: {
                image: "id",
                "tags": [{"_id": "id"}],
                "tag": "_id"
           }
        }
    }
}
 ```
 * @param data
 */
export function convertQueryFormatToCreateFormat(
  data: InstallationTemplateDBInterface
) {
  const deepCopied = JSON.parse(JSON.stringify(data));
  deepCopied.services = data.services.map((s) => {
    const image = JSON.parse(s.service.image as unknown as string);
    const tagId = typeof image.tag === "string" ? image.tag : image.tag._id;
    const imageId = typeof image.image === "string" ? image.image : image._id;

    return {
      ...s,
      service: {
        ...s.service,
        image: {
          tag: tagId,
          image: imageId,
        },
      },
    };
  });

  return deepCopied;
}

export * as yaml from "yaml";
