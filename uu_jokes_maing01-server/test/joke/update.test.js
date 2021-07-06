const { TestHelper } = require("uu_appg01_server-test");
const useCase = "joke/update";
let id;
let session;
beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U", state: "active" });
  session = await TestHelper.login("AwidLicenseOwner", false, false);
  const dtoIn = {
    name: "vika",
    text: "is",
    code: "some_code4",
  };
  const { data } = await TestHelper.executePostCommand("joke/create", dtoIn, session);
  id = data.id;
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`Testing ${useCase} uuCmd...`, () => {
  test("HDS - SHO TAM", async () => {
    //
    const dtoIn = {
      name: "vika",
      text: "kiss",
      code: "some_code1",
      id,
    };

    const result = await TestHelper.executePostCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    const dtoIn = {
      name: "vika",
      text: "is",
      code: "some_code4",
      type: "simple",
      id,
    };

    const errorCode = "uu-jokes-main/joke/update/unsupportedKeys";

    const result = await TestHelper.executePostCommand(useCase, dtoIn, session);
    console.log(result);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    expect.assertions(3);

    const errorCode = `uu-jokes-main/${useCase}/invalidDtoIn`;

    const dtoIn = {
      name: "vika",
      text: 1,
      code: false,
      id,
    };

    try {
      await TestHelper.executePostCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });

  test("Update joke by joke Dao update failed.", async () => {
    const dtoIn = {
      name: "vika",
      text: "is",
      code: "some_code3",
      id,
    };

    const errorCode = `uu-jokes-main/${useCase}/jokeDaoUpdateFailed`;

    try {
      await TestHelper.executePostCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
});
