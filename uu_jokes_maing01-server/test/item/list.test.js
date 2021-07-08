const { TestHelper } = require("uu_appg01_server-test");
const useCase = "item/list";
let id;
let itemId;
let session;
beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U", state: "active" });

  const { data } = await TestHelper.executePostCommand("list/create", { name: "testList" }, session);
  const { data: itemRes } = await TestHelper.executePostCommand(
    "item/create",
    { listId: data.id, text: "a lot to do" },
    session
  );
  id = data.id;
  itemId = itemRes.id;
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`Testing ${useCase} uuCmd...`, () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      listId: id,
      completed: true,
      pageInfo: {
        pageIndex: 0,
        pageSize: 5,
      },
    };

    const result = await TestHelper.executeGetCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      name: "vika",
      listId: id,
      completed: true,
      pageInfo: {
        pageIndex: 0,
        pageSize: 5,
      },
    };

    const errorCode = "uu-jokes-main/item/list/unsupportedKeys";

    const result = await TestHelper.executeGetCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    const errorCode = `uu-jokes-main/${useCase}/invalidDtoIn`;

    const dtoIn = {
      listId: id,
      completed: 1,
      pageInfo: {
        pageIndex: 0,
        pageSize: 5,
      },
    };

    try {
      await TestHelper.executeGetCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });

  test("Item with given id does not exist.", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      listId: id,
      completed: true,
      pageInfo: {
        pageIndex: 0,
        pageSize: 5,
      },
    };

    const errorCode = `uu-jokes-main/${useCase}/itemDoesNotExist`;

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
      listId: id,
      completed: true,
      pageInfo: {
        pageIndex: 0,
        pageSize: 5,
      },
    };
    const { data } = await TestHelper.executeGetCommand(useCase, dtoIn, session);
    expect(typeof data.pageInfo).toEqual("object");
    expect(typeof data.pageInfo.pageIndex).toEqual("number");
    expect(typeof data.pageInfo.pageSize).toEqual("number");
  });
});
