const { TestHelper } = require("uu_appg01_server-test");
const useCase = "item/update";
let id;
let session;
let itemId;
beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U", state: "active" });
  session = await TestHelper.login("AwidLicenseOwner", false, false);
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
    const dtoIn = {
      listId: id,
      text: "meow",
      id: itemId,
    };

    const result = await TestHelper.executePostCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("unsupported keys", async () => {
    const dtoIn = {
      type: "simple",
      listId: id,
      text: "meow",
      id: itemId,
    };

    const errorCode = "uu-jokes-main/item/update/unsupportedKeys";

    const result = await TestHelper.executePostCommand(useCase, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap[errorCode]).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    expect.assertions(3);

    const errorCode = `uu-jokes-main/${useCase}/invalidDtoIn`;

    const dtoIn = {
      listId: id,
      text: 1,
      id: itemId,
    };

    try {
      await TestHelper.executePostCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });

  test("Update item by item DAO update failed.", async () => {
    const dtoIn = {
      listId: id,
      text: "meow",
      id: itemId,
    };

    const errorCode = `uu-jokes-main/${useCase}/itemDaoUpdateFailed`;

    try {
      await TestHelper.executePostCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
  test("Item with given id does not exist.", async () => {
    const dtoIn = {
      listId: id,
      text: "meow",
      id: itemId,
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
  test("List with given id does not exist.", async () => {
    const dtoIn = {
      listId: id,
      text: "meow",
      id: itemId,
    };

    const errorCode = `uu-jokes-main/${useCase}/listDoesNotExist`;

    try {
      await TestHelper.executePostCommand(useCase, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(errorCode);
      expect(e.dtoOut.uuAppErrorMap).toBeDefined();
    }
  });
});
