import { Environments } from "../../configs";

describe("Given a environment", () => {
  test("When calling get server side environments", () => {
    const result = Environments.ServerSideEnvironments;
    expect(result).toBeDefined();
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  test("When calling get client side environments", () => {
    const result = Environments.ClientSideEnvironments;
    expect(result).toBeDefined();
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  test("When calling get schema", () => {
    const result = Environments.getSchemaForEnvironments(
      Environments.ServerSideEnvironments,
      Environments.ClientSideEnvironments
    );
    //@ts-ignore
    expect(Object.keys(result.properties?.clientEnvs.properties).length).toBe(
      Object.keys(Environments.ClientSideEnvironments).length
    );
    //@ts-ignore
    expect(Object.keys(result.properties?.serverEnvs.properties).length).toBe(
      Object.keys(Environments.ServerSideEnvironments).length
    );

    expect(
      Object.keys((result.properties?.serverEnvs as any).properties)
    ).toStrictEqual(Object.keys(Environments.ServerSideEnvironments));

    expect(
      Object.keys((result.properties?.clientEnvs as any).properties)
    ).toStrictEqual(Object.keys(Environments.ClientSideEnvironments));
  });
});
