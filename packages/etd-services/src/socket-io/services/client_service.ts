import { configs, enums } from "@etherdata-blockchain/common";
import { Server, Socket } from "socket.io";
import { APpService } from "./app_service";

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
      this.handlePushUpdates,
      this.dockerCommandHandler,
    ];
  }

  auth(password: string): boolean {
    return (
      configs.Environments.ClientSideEnvironments
        .NEXT_PUBLIC_CLIENT_PASSWORD === password
    );
  }

  async startSocketIOServer(server: Server): Promise<boolean | undefined> {
    this.server = server.of("/clients");
    this.connectServer();
    return true;
  }

  protected onUnAuthenticated(socket: Socket): void {}
}
