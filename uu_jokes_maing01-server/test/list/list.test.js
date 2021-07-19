const { TestHelper } = require("uu_appg01_server-test");
const useCase = "list/list";
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
      pageInfo: {
        pageIndex: 1,
        pageSize: 2,
      },
    };

    const result = await TestHelper.executeGetCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      pageInfo: {
        pageIndex: 1,
        pageSize: 2,
      },
      sortBy: "sen",
    };

    const errorCode = "uu-jokes-main/list/list/unsupportedKeys";

    const result = await TestHelper.executeGetCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    const errorCode = `uu-jokes-main/${useCase}/invalidDtoIn`;

    const dtoIn = {
      pageInfo: "sen",
    };

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });

  // TODO rev the first and this test are the same - HDS means
  //  Happy Day Scenario (when everything is good),

  test("Everything is good", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      pageInfo: {
        pageIndex: 1,
        pageSize: 2,
      },
    };
    const { data } = await TestHelper.executeGetCommand(useCase, dtoIn, session);

    expect(typeof data.pageInfo).toEqual("object");
    expect(typeof data.pageInfo.pageIndex).toEqual("number");
    expect(typeof data.pageInfo.pageSize).toEqual("number");
  });
});
