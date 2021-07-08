const { TestHelper } = require("uu_appg01_server-test");
const useCase = "item/delete";
let id;
let itemId;
let session;
beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U", state: "active" });
  session = await TestHelper.login("AwidLicenseOwner", false, false);

  const { data } = await TestHelper.executePostCommand("list/create", { name: "testList" }, session);
  const { data: itemRes } = await TestHelper.executePostCommand(
    "item/create",
    { listId: data.id, text: "run" },
    session
  );
  id = data.id;
  itemId = itemRes.id;
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe(`Testing ${useCase} uuCmd...`, () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      id: itemId,
      forceDelete: true,
    };

    const result = await TestHelper.executePostCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      forceDelete: true,
      type: "simple",
      id: itemId,
    };

    const errorCode = "uu-jokes-main/item/delete/unsupportedKeys";

    const result = await TestHelper.executePostCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    const errorCode = `uu-jokes-main/${useCase}/invalidDtoIn`;

    const dtoIn = {
      id: itemId,
      forceDelete: "st",
    };

    try {
      await TestHelper.executePostCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });

  test("Delete item by item DAO delete failed.", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      id: itemId,
      forceDelete: true,
    };

    const errorCode = `uu-jokes-main/${useCase}/itemDaoDeleteFailed`;

    try {
      await TestHelper.executePostCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
  test("Item with given id does not exist.", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      id: itemId,
      forceDelete: true,
    };

    const errorCode = `uu-jokes-main/${useCase}/itemDoesNotExist`;

    try {
      await TestHelper.executePostCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
});
