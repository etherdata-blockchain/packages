import { createMocks } from "node-mocks-http";
import { StatusCodes } from "http-status-codes";
import { okHandler } from "./utils";
import { methodAllowedHandler } from "../handlers/method_allowed_handler";
import HTTPMethod from "http-method-enum";
import { paginationHandler } from "../handlers/pagination_handler";

describe("Given a pagination handler", () => {
  test("When calling with a GET request", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });
    await paginationHandler(okHandler)(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.OK);
  });

  test("When calling with a GET request", async () => {
    const page = "1";
    const pageSize = "2";
    const { req, res } = createMocks({
      method: "GET",
      query: {
        page,
        pageSize,
      },
    });
    await paginationHandler((req, res) => {
      const { page, pageSize } = req.body;
      expect(page).toBe(parseInt(page));
      expect(pageSize).toBe(parseInt(pageSize));
    })(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.OK);
  });

  test("When calling with a GET request with invalid page configurations", async () => {
    const page = "false";
    const pageSize = "2";
    const { req, res } = createMocks({
      method: "GET",
      query: {
        page,
        pageSize,
      },
    });
    await paginationHandler(okHandler)(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.BAD_REQUEST);
  });

  test("When calling with a GET request with invalid page configurations", async () => {
    const page = "12!";
    const pageSize = "2";
    const { req, res } = createMocks({
      method: "GET",
      query: {
        page,
        pageSize,
      },
    });
    await paginationHandler(okHandler)(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.BAD_REQUEST);
  });

  test("When calling with a GET request with invalid page configurations", async () => {
    const page = "";
    const pageSize = "";
    const { req, res } = createMocks({
      method: "GET",
      query: {
        page,
        pageSize,
      },
    });
    await paginationHandler(okHandler)(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.BAD_REQUEST);
  });
});
