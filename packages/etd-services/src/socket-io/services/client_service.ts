import { configs, enums } from "@etherdata-blockchain/common";
import { Server, Socket } from "socket.io";
import { APpService } from "./app_service";
import Logger from "@etherdata-blockchain/logger";

/**
 * Web Browser socket io plugin
 */
export class ClientService extends APpService {
  serviceName = enums.SocketIOServiceName.client;

  constructor() {
    super();
    this.handlers = [
      this.joinRoomHandler,
      this.leaveRoomHandler,
      this.rpcCommandHandler,
      this.disconnectHandler,
      this.dockerCommandHandler,
    ];
  }

  auth(password: string): boolean {
    if (
      configs.Environments.ClientSideEnvironments.NEXT_PUBLIC_SECRET !==
      password
    ) {
      Logger.info(
        `${configs.Environments.ClientSideEnvironments.NEXT_PUBLIC_SECRET} is not equal to ${password}, rejecting...`
      );
    }
    return (
      configs.Environments.ClientSideEnvironments.NEXT_PUBLIC_SECRET ===
      password
    );
  }

  async startSocketIOServer(server: Server): Promise<boolean | undefined> {
    this.server = server.of("/clients");
    this.connectServer();
    return true;
  }

  protected onUnAuthenticated(socket: Socket): void {}
}
