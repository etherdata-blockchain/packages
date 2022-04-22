import { getLocalIpAddress } from "../index";
import os from "os";
jest.mock("os");

describe("Given a ip address handler", () => {
  test("When getting ip address", () => {
    (os.networkInterfaces as jest.Mock).mockReturnValue({
      en0: [
        {
          address: "192.168.31.120",
          family: "IPv4",
        },
        {
          address: "fe80::999:41f8:e29b:b23e",
          family: "IPv6",
        },
      ],
    });
    const address = getLocalIpAddress();
    expect(address).toStrictEqual({
      en0: ["192.168.31.120"],
    });
  });

  test("When getting ip address", () => {
    (os.networkInterfaces as jest.Mock).mockReturnValue({
      en0: [
        {
          address: "192.168.31.120",
          family: "IPv4",
        },
        {
          address: "fe80::999:41f8:e29b:b23e",
          family: "IPv6",
        },
      ],

      en1: [
        {
          address: "192.168.31.120",
          family: "IPv4",
        },
        {
          address: "fe80::999:41f8:e29b:b23e",
          family: "IPv6",
        },
      ],
    });
    const address = getLocalIpAddress();
    expect(address).toStrictEqual({
      en0: ["192.168.31.120"],
      en1: ["192.168.31.120"],
    });
  });

  test("When getting ip address", () => {
    (os.networkInterfaces as jest.Mock).mockReturnValue({});
    const address = getLocalIpAddress();
    expect(address).toStrictEqual({});
  });
});
