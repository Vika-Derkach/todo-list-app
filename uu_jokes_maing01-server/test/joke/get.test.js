const { TestHelper } = require("uu_appg01_server-test");
beforeEach(async () => {
  // fire up application and database
  // Authentication, Authorization and verification of System States are disabled, because they are not objective of testing
  await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("Joke uuCMD tests", () => {
  test("example 01 test - joke/get", async () => {
    const jokeText = "testJoke01";
    let result = await TestHelper.executePostCommand("joke/get", { joke: jokeText });

    expect(result.data.joke).toEqual(jokeText);
    expect(result.data.uuAppErrorMap).toEqual({});
  });
});
