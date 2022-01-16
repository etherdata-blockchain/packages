/**
 * App plugin for app use
 */

import Logger from "@etherdata-blockchain/logger";
import { configs, enums } from "@etherdata-blockchain/common";
import { schema } from "@etherdata-blockchain/storage-model";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { BaseSocketIOAuthService, SocketHandler } from "../socket_io_service";
import { PendingJobService } from "../../mongodb/services/job/pending_job_service";

// eslint-disable-next-line valid-jsdoc
/**
 * App service is used for mobile app
 */
export class APpService extends BaseSocketIOAuthService {
  serviceName: enums.SocketIOServiceName = enums.SocketIOServiceName.app;

  /**
   * SocketID: UserID
   * @protected
   */
  protected user: { [key: string]: string } = {};

  // eslint-disable-next-line require-jsdoc
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

  // eslint-disable-next-line require-jsdoc
  auth(password: string): boolean {
    // Use jwt authentication
    const secret = configs.Environments.ServerSideEnvironments.PUBLIC_SECRET;
    try {
      jwt.verify(password, secret);

      return true;
    } catch (err) {
      // return false;
      return true;
    }
  }

  async startSocketIOServer(server: Server): Promise<boolean | undefined> {
    this.server = server.of("/apps");
    this.connectServer();
    return true;
  }

  disconnectHandler: SocketHandler = (socket) => {
    socket.on("disconnect", () => {
      delete this.user[socket.id];
    });
  };

  /**
   * Join room when user send join room request
   * @param socket
   */
  joinRoomHandler: SocketHandler = (socket) => {
    socket.on("join-room", async (roomId: string) => {
      if (socket.rooms.size > 2) {
        socket.emit("join-room-error", {
          err: "You have already joined another room. You need to leave first!",
        });
        return;
      }

      Logger.info("Joining room " + roomId);
      socket.join(roomId);
    });
  };

  /**
   * Leave room when user send leave room request
   * @param socket
   */
  leaveRoomHandler: SocketHandler = (socket) => {
    socket.on("leave-room", (roomId: string) => {
      socket.leave(roomId);
    });
  };

  /**
   * Send rpc command based on joined room.
   * @param socket
   */
  rpcCommandHandler: SocketHandler = (socket) => {
    socket.on(
      "rpc-command",
      async (command: enums.Web3ValueType, uuid: number | undefined) => {
        const pendingJobPlugin = new PendingJobService();
        const selectedRoom = this.canSubmitJob(socket);
        if (selectedRoom) {
          const job = {
            id: uuid,
            targetDeviceId: selectedRoom,
            from: socket.id,
            time: new Date(),
            task: {
              type: enums.JobTaskType.Web3,
              value: command,
            },
          };
          /// Add id if user defined
          if (uuid) {
            //@ts-ignore
            // eslint-disable-next-line new-cap
            job._id = mongoose.mongo.ObjectId(uuid);
          }
          //@ts-ignore
          await pendingJobPlugin.create(job, {});
        } else {
          Logger.error("Cannot run rpc-command, not in any room!");
          socket.emit("rpc-error", {
            err: "Cannot join the room. Not in any room!",
          });
        }
      }
    );
  };

  /**
   * Send docker command based on joined room.
   * @param socket
   */
  dockerCommandHandler: SocketHandler = (socket) => {
    socket.on("docker-command", async (value: any, uuid: string) => {
      console.log("Getting docker command", value, uuid);
      const pendingJobPlugin = new PendingJobService();
      // eslint-disable-next-line no-invalid-this
      const selectedRoom = this.canSubmitJob(socket);
      if (selectedRoom) {
        const job = {
          id: uuid,
          targetDeviceId: selectedRoom,
          from: socket.id,
          time: new Date(),
          task: {
            type: enums.JobTaskType.Docker,
            value: value,
          },
        };
        /// Add id if user defined
        if (uuid) {
          //@ts-ignore
          // eslint-disable-next-line new-cap
          job._id = mongoose.mongo.ObjectId(uuid);
        }
        //@ts-ignore
        await pendingJobPlugin.create(job, {});
      } else {
        Logger.error("Cannot run docker-command, not in any room!");
        socket.emit("docker-error", {
          err: "Cannot join the room. Not in any room!",
        });
      }
    });
  };

  handlePushUpdates: SocketHandler = (socket) => {
    socket.on(
      "push-update",
      async (imageName: string, version: string, uuid: number | undefined) => {
        const pendingJobPlugin = new PendingJobService();
        // eslint-disable-next-line no-invalid-this
        const selectedRoom = this.canSubmitJob(socket);
        if (selectedRoom) {
          const job = {
            targetDeviceId: selectedRoom,
            from: socket.id,
            time: new Date(),
            task: {
              type: "update-docker",
              value: {
                imageName,
                version,
              },
            },
          };
          //@ts-ignore
          // eslint-disable-next-line new-cap
          job._id = mongoose.mongo.ObjectId(uuid);
          //@ts-ignore
          await pendingJobPlugin.create(job, {});
        } else {
          Logger.error("Cannot run update-command, not in any room!");
          socket.emit("update-command-error", {
            err: "Cannot join the room. Not in any room!",
          });
        }
      }
    );
  };

  protected async onAuthenticated(
    socket: Socket,
    password: string
  ): Promise<void> {
    const data = jwt.decode(password, { json: true });
    this.user[socket.id] = data?.user;
    socket.emit(
      enums.SocketIOEvents.pendingJob,
      await schema.PendingJobModel.countDocuments({})
    );
  }

  // eslint-disable-next-line require-jsdoc
  protected onUnAuthenticated(socket: Socket): void {}

  // eslint-disable-next-line require-jsdoc
  private canSubmitJob(socket: Socket): string | undefined {
    const rooms = Array.from(socket.rooms);
    if (rooms.length < 2) {
      return undefined;
    } else {
      return rooms[1];
    }
  }
}
