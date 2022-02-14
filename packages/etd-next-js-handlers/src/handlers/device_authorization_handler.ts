import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { dbServices } from "@etherdata-blockchain/services";
import { StatusCodes } from "http-status-codes";

/**
 * Will try to authorize user from db. If authorized, then return a new key, otherwise, return an error.
 * @param{NextApiRequest} fn
 * @constructor
 */
export const deviceAuthorizationHandler =
  (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const { user: deviceId, key } = req.body;
    const deviceRegistrationService =
      new dbServices.DeviceRegistrationService();
    const [authorized, newKey] = await deviceRegistrationService.auth(
      deviceId,
      key
    );
    if (!authorized) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ reason: "Your key is not correct" });
      return;
    }
    req.body.key = newKey;
    return fn(req, res);
  };
