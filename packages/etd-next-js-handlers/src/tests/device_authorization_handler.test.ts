import { dbServices } from "@etherdata-blockchain/services";
import { createMocks } from "node-mocks-http";
import { okHandler } from "./utils";
import { StatusCodes } from "http-status-codes";
import { mockData } from "@etherdata-blockchain/common";
import { deviceAuthorizationHandler } from "../handlers/device_authorization_handler";

jest.mock("@etherdata-blockchain/services");

describe("Given a device authorization handler", () => {
  test("When device exists", async () => {
    (dbServices.DeviceRegistrationService as any).mockImplementation(() => ({
      auth: jest.fn().mockReturnValue([true, "new_key"]),
    }));

    const { req, res } = createMocks({
      method: "GET",
      body: {
        user: mockData.MockUser,
      },
    });

    await deviceAuthorizationHandler(okHandler)(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.OK);
  });

  test("When device doesn't exist", async () => {
    (dbServices.DeviceRegistrationService as any).mockImplementation(() => ({
      auth: jest.fn().mockReturnValue([false, "new_key"]),
    }));

    const { req, res } = createMocks({
      method: "GET",
      body: {
        user: mockData.MockUser,
      },
    });

    await deviceAuthorizationHandler(okHandler)(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.UNAUTHORIZED);
  });

  test("When device key is not provided", async () => {
    (dbServices.DeviceRegistrationService as any).mockImplementation(() => ({
      auth: jest.fn().mockReturnValue([false, "new_key"]),
    }));

    const { req, res } = createMocks({
      method: "GET",
    });

    await deviceAuthorizationHandler(okHandler)(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.UNAUTHORIZED);
  });
});
