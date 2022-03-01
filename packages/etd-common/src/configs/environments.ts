/**
 * All used environment
 */
import { JSONSchema7 } from "json-schema";

/**
 * Environments used in admin server
 */
export class Environments {
  /**
   * Get serverside environments
   * @STATS_SERVER ETD Stats API endpoint
   * @MONGODB_URL backend database's api
   * @PUBLIC_SECRET use to authenticate the user. Should be equal to @NEXT_PUBLIC_SECRET
   * @STORAGE_MANAGEMENT_URL is the api endpoint for storage management system
   * @STORAGE_MANAGEMENT_API_TOKEN API token for storage management system
   *
   * @constructor
   */
  static get ServerSideEnvironments() {
    return {
      STATS_SERVER: process.env.STATS_SERVER!,
      MONGODB_URL: process.env.MONGODB_URL!,
      PUBLIC_SECRET: process.env.PUBLIC_SECRET!,
      STORAGE_MANAGEMENT_URL: process.env.STORAGE_MANAGEMENT_URL!,
      STORAGE_MANAGEMENT_API_TOKEN: process.env.STORAGE_MANAGEMENT_API_TOKEN!,
    };
  }

  /**
   * Get client side environments starts with NEXT_
   * Only can be used on client side.
   *
   * @NEXT_PUBLIC_SECRET should equal to PUBLIC_SECRET used for client to send http request to the backend server
   * @NEXT_PUBLIC_APP_ID  is the realm api's api id
   * @NEXT_PUBLIC_VERSION is th current version of the app
   * @constructor
   */
  static get ClientSideEnvironments() {
    return {
      NEXT_PUBLIC_SECRET: process.env.NEXT_PUBLIC_SECRET!,
      NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID!,
      NEXT_PUBLIC_STATS_SERVER: process.env.NEXT_PUBLIC_STATS_SERVER!,
      NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION!,
    };
  }

  /**
   * Get schema for environments
   * @param serverEnvs
   * @param clientEnvs
   */
  static getSchemaForEnvironments(
    serverEnvs: {
      [key: string]: string;
    },
    clientEnvs: { [key: string]: string }
  ): JSONSchema7 {
    const clientSchema: { [key: string]: JSONSchema7 } = {};
    const serverSchema: { [key: string]: JSONSchema7 } = {};

    for (const [key, value] of Object.entries(clientEnvs)) {
      clientSchema[key] = {
        title: key,
        type: "string",
        default: value,
      };
    }

    for (const [key, value] of Object.entries(serverEnvs)) {
      serverSchema[key] = {
        title: key,
        type: "string",
        default: value,
      };
    }

    return {
      title: "Environments",
      description: "List of environments used",
      properties: {
        clientEnvs: {
          title: "Client Environments",
          type: "object",
          properties: clientSchema,
        },
        serverEnvs: {
          title: "Server Environments",
          type: "object",
          properties: serverSchema,
        },
      },
    };
  }
}
