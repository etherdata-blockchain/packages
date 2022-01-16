import { createMocks } from "node-mocks-http";
import { StatusCodes } from "http-status-codes";
import { okHandler } from "./utils";
import { methodAllowedHandler } from "../handlers/method_allowed_handler";
import HTTPMethod from "http-method-enum";

describe("Given method allowed handler", () => {
  test("When calling GET request on GET allowed handler", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await methodAllowedHandler(okHandler, [HTTPMethod.GET])(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.OK);
  });

  test("When calling GET request on POST allowed handler", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await methodAllowedHandler(okHandler, [HTTPMethod.POST])(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.METHOD_NOT_ALLOWED);
  });

  test("When calling POST request on POST, PATCH allowed handler", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    await methodAllowedHandler(okHandler, [HTTPMethod.POST, HTTPMethod.PATCH])(
      req,
      res
    );
    expect(res._getStatusCode()).toBe(StatusCodes.OK);
  });

  test("When calling POST request on nothing allowed handler", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    await methodAllowedHandler(okHandler, [])(req, res);
    expect(res._getStatusCode()).toBe(StatusCodes.METHOD_NOT_ALLOWED);
  });
});
