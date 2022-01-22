import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { configs } from "@etherdata-blockchain/common";

/**
 * Handle list requests with pagination. Only will do the pagination on Get request.
 * If the request is a get request, then it will include **page** and **pageSize** fields.
 * It will check if **page** and **pageSize** query parameter
 * in the request body. If not, the default value will be used.
 * @param {NextApiHandler} fn
 * @constructor
 */
export const paginationHandler =
  (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    const page =
      (req.query.page as string) ??
      `${configs.Configurations.defaultPaginationStartingPage}`;
    const pageSize =
      (req.query.pageSize as string) ??
      `${configs.Configurations.numberPerPage}`;

    if (pageSize.length === 0 || page.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ err: "Neither page size nor page should be an empty string" });
      return;
    }

    try {
      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);

      if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ err: "Cannot parse pagination request" });
        return;
      }

      req.body = {
        ...req.body,
        page: pageNumber,
        pageSize: pageSizeNumber,
      };
      return fn(req, res);
    } catch (e) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ err: "Cannot parse pagination request" });
    }
  };
