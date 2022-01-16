import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

export async function okHandler(req: NextApiRequest, res: NextApiResponse) {
  res.status(StatusCodes.OK).json({});
}
