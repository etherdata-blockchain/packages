import { Namespace, Server, Socket } from "socket.io";
import Logger from "@etherdata-blockchain/logger";
import { BaseService } from "../general_service";
import { enums } from "@etherdata-blockchain/common";

export type SocketHandler = (socket: Socket) => void;

export interface PeriodicJob {
  /**
   * In seconds
   */
  interval: number;
  name: string;
  timer?: NodeJS.Timer;

  job(): Promise<void>;
}

/**
 * Basic socket io plugin
 */
export abstract class BaseSocketIOService extends BaseService<enums.SocketIOServiceName> {
  protected otherPlugins: { [key: string]: BaseSocketIOService } = {};
  protected periodicJobs: PeriodicJob[] = [];

  /**
   * Starting the plugin. This will also start the periodic jobs
   * @param{Server} server socket io server
   */
  async startPlugin(server: Server) {
    let count = 0;
    for (const job of this.periodicJobs) {
      job.timer = setInterval(async () => {
        await job.job();
      }, job.interval * 1000);
      this.periodicJobs[count] = job;
      count += 1;
    }
  }

  /**
   * Stop periodic job by job name
   * @param{string} name job name
   */
  stopPeriodicJobByName(name: string) {
    const job = this.periodicJobs.find((j) => j.name === name);
    if (job) {
      clearInterval(job.timer!);
    } else {
      throw new Error("Cannot find job with this name");
    }
  }

  /**
   * Connect plugins to other plugins. So that this plugin can use other plugins' functionalities.
   * And also can be used by others.
   * @param{BaseSocketAuthIOPlugin[]} plugins list of socket io plugins
   */
  connectPlugins(plugins: BaseSocketIOService[]) {
    for (const plugin of plugins) {
      if (plugin.serviceName !== this.serviceName) {
        this.otherPlugins[plugin.serviceName] = plugin;
      }
    }
  }

  /**
   * Find other plugin by name
   * @param{RegisteredPlugins} pluginName A defined plugin name. You need to register your plugin before usage
   * @protected
   * @return{BaseSocketIOService} Found plugin
   */
  protected findService<T extends BaseSocketIOService>(
    pluginName: enums.SocketIOServiceName
  ): T | undefined {
    try {
      //@ts-ignore
      return this.otherPlugins[pluginName];
    } catch (err) {
      throw new Error("Cannot find this plugin with name " + pluginName);
    }
  }
}

/**
 * Base socket io plugin with authentication function
 */
export abstract class BaseSocketIOAuthService extends BaseSocketIOService {
  /**
   * List of socket handlers
   */
  handlers: SocketHandler[] = [];
  /**
   * Socket IO Server
   */
  server?: Namespace;
  protected otherPlugins: { [key: string]: BaseSocketIOService } = {};

  /**
   * Start a SocketIO server.
   * @param server
   *
   * @return an indicator indicates the status of the socket io.
   * If return undefined, then this plugin doesn't have websocket functionality
   */
  abstract startSocketIOServer(server: Server): Promise<boolean | undefined>;

  /**
   * Authenticate with configuration's password
   * @param password
   */
  abstract auth(password: string): boolean;

  /**
   * Start a socket io plugin with authentication function enabled
   * @param server
   */
  async startPlugin(server: Server) {
    await super.startPlugin(server);
    await this.startSocketIOServer(server);
  }

  /**
   * This will authenticate clients. If the client provide a valid token, then it will be authenticated.
   * Otherwise, the connection between client and server will be dropped
   */
  connectServer() {
    if (this.server === undefined) {
      throw new Error("You should initialize your server");
    } else {
      Logger.info("Starting socker server");
      this.server.on("connection", (socket) => {
        const token = socket.handshake.auth.token;
        const authenticated = this.auth(token);
        if (authenticated) {
          Logger.info(
            `[${this.serviceName}]: Client ${socket.id} is authenticated!`
          );
          this.onAuthenticated(socket, token);
          for (const handle of this.handlers) {
            handle(socket);
          }
        } else {
          Logger.error(
            `[${this.serviceName}]: Client ${socket.id} is not authenticated, drop connection`
          );
          this.onUnAuthenticated(socket);
        }
      });
    }
  }

  protected abstract onAuthenticated(socket: Socket, password: string): void;

  protected abstract onUnAuthenticated(socket: Socket): void;
}
