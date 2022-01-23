import {
  convertFromToArrayToMap,
  convertQueryFormatToCreateFormat,
  convertServicesListToMap,
  expandImages,
} from "../../utils";
import {
  MockDockerImage,
  MockDockerImage2,
  MockDockerImage3,
  MockDockerImage4,
  MockEmptyServiceTemplateData,
  MockImageId,
  MockInstallationTemplateDataWithId,
  MockJSONSchemaFormInstallationTemplateData,
  MockTagId,
} from "../../mockdata";

describe("Given a install script utils", () => {
  test("When calling postprocess handler", () => {
    const result = convertServicesListToMap(
      MockJSONSchemaFormInstallationTemplateData as any
    );
    expect(result.services.worker).toBe(
      MockJSONSchemaFormInstallationTemplateData.services[0].service
    );
  });

  test("When calling expanding images", () => {
    const result = expandImages([MockDockerImage3]);
    expect(result.length).toBe(2);
  });

  test("When calling expanding images with multiple images", () => {
    const result = expandImages([
      MockDockerImage,
      MockDockerImage2,
      MockDockerImage3,
    ]);
    expect(result.length).toBe(4);
  });

  test("When calling expanding images with empty tag", () => {
    const result = expandImages([MockDockerImage4]);
    expect(result.length).toBe(1);
  });

  test("When calling convert queryFormatToCreateFormat", () => {
    const deepCopied = JSON.parse(
      JSON.stringify(MockInstallationTemplateDataWithId)
    );
    deepCopied.services[0].service.image = JSON.stringify(
      deepCopied.services[0].service.image
    );
    const result = convertQueryFormatToCreateFormat(deepCopied);
    // @ts-ignore
    expect(result.services[0].service.image.image).toBe(
      MockInstallationTemplateDataWithId.services[0].service.image._id
    );
    expect(result.services[0].service.image.tag).toBe(
      MockInstallationTemplateDataWithId.services[0].service.image.tag._id
    );
  });

  test("When calling convert queryFormatToCreateFormat", () => {
    const deepCopied = JSON.parse(
      JSON.stringify(MockInstallationTemplateDataWithId)
    );
    deepCopied.services[0].service.image = JSON.stringify({
      image: MockImageId,
      tag: MockTagId,
    });
    const result = convertQueryFormatToCreateFormat(deepCopied);
    // @ts-ignore
    expect(result.services[0].service.image.image).toBe(
      MockInstallationTemplateDataWithId.services[0].service.image._id
    );
    expect(result.services[0].service.image.tag).toBe(
      MockInstallationTemplateDataWithId.services[0].service.image.tag._id
    );
  });

  test("When calling convert queryFormatToCreateFormat", () => {
    const result = convertQueryFormatToCreateFormat(
      MockEmptyServiceTemplateData as any
    );
    expect(result.services.length).toBe(0);
  });
});

describe("Given a install script utils", () => {
  test("When calling postprocess handler", () => {
    const result = convertServicesListToMap(
      MockJSONSchemaFormInstallationTemplateData as any
    );
    expect(result.services.worker).toBe(
      MockJSONSchemaFormInstallationTemplateData.services[0].service
    );
  });

  test("When calling expanding images", () => {
    const result = expandImages([MockDockerImage3]);
    expect(result.length).toBe(2);
  });

  test("When calling expanding images with multiple images", () => {
    const result = expandImages([
      MockDockerImage,
      MockDockerImage2,
      MockDockerImage3,
    ]);
    expect(result.length).toBe(4);
  });

  test("When calling expanding images with empty tag", () => {
    const result = expandImages([MockDockerImage4]);
    expect(result.length).toBe(1);
  });

  test("When calling convert queryFormatToCreateFormat", () => {
    const deepCopied = JSON.parse(
      JSON.stringify(MockInstallationTemplateDataWithId)
    );
    deepCopied.services[0].service.image = JSON.stringify(
      deepCopied.services[0].service.image
    );
    const result = convertQueryFormatToCreateFormat(deepCopied);
    // @ts-ignore
    expect(result.services[0].service.image.image).toBe(
      MockInstallationTemplateDataWithId.services[0].service.image._id
    );
    expect(result.services[0].service.image.tag).toBe(
      MockInstallationTemplateDataWithId.services[0].service.image.tag._id
    );
  });

  test("When calling convert queryFormatToCreateFormat", () => {
    const deepCopied = JSON.parse(
      JSON.stringify(MockInstallationTemplateDataWithId)
    );
    deepCopied.services[0].service.image = JSON.stringify({
      image: MockImageId,
      tag: MockTagId,
    });
    const result = convertQueryFormatToCreateFormat(deepCopied);
    // @ts-ignore
    expect(result.services[0].service.image.image).toBe(
      MockInstallationTemplateDataWithId.services[0].service.image._id
    );
    expect(result.services[0].service.image.tag).toBe(
      MockInstallationTemplateDataWithId.services[0].service.image.tag._id
    );
  });

  test("When calling convert queryFormatToCreateFormat", () => {
    const result = convertQueryFormatToCreateFormat(
      MockEmptyServiceTemplateData as any
    );
    expect(result.services.length).toBe(0);
  });
});

describe("Given an update template utils", () => {
  test("When calling convertFromToArrayToMap", () => {
    const obj = {
      name: "Hello",
      envs: [
        {
          from: "a",
          to: "b",
        },
        {
          from: "c",
          to: "d",
        },
      ],
    };
    const result = convertFromToArrayToMap(obj, ["envs"]);
    expect(result.name).toBe(obj.name);
    expect(result.envs).toStrictEqual({ a: "b", c: "d" });
  });

  test("When calling convertFromToArrayToMap", () => {
    const obj = {
      name: "Hello",
      config: {
        envs: [
          {
            from: "a",
            to: "b",
          },
          {
            from: "c",
            to: "d",
          },
        ],
      },
    };
    const result = convertFromToArrayToMap(obj, ["envs"]);
    expect(result.name).toBe(obj.name);
    expect(result.config.envs).toStrictEqual({ a: "b", c: "d" });
  });
});
