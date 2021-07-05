"use strict";
const JokeAbl = require("../../abl/joke-abl.js");

class JokeController {
  update(ucEnv) {
    return JokeAbl.update(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
    );
  }
  delete(ucEnv) {
    return JokeAbl.delete(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
    );
  }

  list(ucEnv) {
    return JokeAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return JokeAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  create(ucEnv) {
    return JokeAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new JokeController();
