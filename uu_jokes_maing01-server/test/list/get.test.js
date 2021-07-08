const { TestHelper } = require("uu_appg01_server-test");
const useCase = "list/get";
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
    code: "some_code4",
  };
  const { data } = await TestHelper.executePostCommand("list/create", dtoIn, session);
  id = data.id;
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`Testing ${useCase} uuCmd...`, () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    const dtoIn = {
      id,
    };

    const result = await TestHelper.executeGetCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      type: "simple",
      id,
    };

    const errorCode = "uu-jokes-main/list/get/unsupportedKeys";

    const result = await TestHelper.executeGetCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    const errorCode = `uu-jokes-main/${useCase}/invalidDtoIn`;

    const dtoIn = {
      name: 1,
      id,
    };

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });

  test("List with given id does not exist.", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      id,
    };

    const errorCode = `uu-jokes-main/${useCase}/listDoesNotExist`;

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
  test("Everything is good", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      name: "vika",
      text: "is",
      code: "some_code9",
      id,
    };
    const { data } = await TestHelper.executeGetCommand(useCase, dtoIn, session);

    expect(data.name).toEqual("vika");
    expect(typeof data.id).toEqual("string");
  });
});
