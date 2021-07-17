"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/joke-error.js");
const BinaryAbl = require("uu_appg01_binarystore-cmd").UuBinaryAbl;

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },

  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },

  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
};
const defaultValues = {
  sortBy: "name",
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

class JokeAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("joke");
    this.daoMain = DaoFactory.getDao("jokesMain");
  }

  async update(awid, dtoIn, session, authorizationResult, uuAppErrorMap = {}) {
    //HDS 1.
    const jokesInstance = await this.daoMain.getByAwid(awid);

    //HDS 1.1
    if (jokesInstance.state !== "active") {
      throw new Errors.Instance.JokesInstanceNotInProperState(uuAppErrorMap, { dtoIn });
    }
    //HDS A1
    else if (!jokesInstance.state) {
      throw new Errors.Instance.JokesInstanceDoesNotExist(uuAppErrorMap, { dtoIn });
    }
    // HDS 2, 2.1
    let validationResult = this.validator.validate("jokeUpdateDtoInType", dtoIn);
    // HDS 2.2, 2.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );
    // HDS 3

    let joke = await this.dao.get(awid, dtoIn.id);
    if (!joke) throw new Errors.Update.JokeDoesNotExist(uuAppErrorMap, { dtoIn });
    let obj = { ...joke, ...dtoIn };
    let dtoOut;

    // HDS 4,
    if (
      session.getIdentity().getUuIdentity() !== joke.uuIdentity &&
      !authorizationResult.getAuthorizedProfiles().includes("Authorities")
    ) {
      throw new Errors.Update.UserNotAuthorized({ uuAppErrorMap });
    }

    //Binary
    if (dtoIn.jokePicCode) {
      let binary;
      if (!joke.jokePicCode) {
        try {
          binary = await UuBinaryAbl.createBinary(awid, { data: dtoIn.jokePicCode });
        } catch (e) {
          throw new Errors.Update.UuBinaryCreateFailed({ uuAppErrorMap }, e);
        }
      } else {
        try {
          binary = await UuBinaryAbl.updateBinaryData(awid, {
            data: dtoIn.jokePicCode,
            code: joke.jokePicCode,
            revisionStrategy: "NONE",
          });
        } catch (e) {
          throw new Errors.Update.UuBinaryUpdateBinaryDataFailed({ uuAppErrorMap }, e);
        }
      }
      dtoIn.jokePicCode = binary.code;
    }
    /////////////////////////////
    try {
      // HDS 7
      dtoOut = await this.dao.update(obj);
    } catch (e) {
      throw new Errors.Update.JokeDaoUpdateFailed(uuAppErrorMap, { dtoIn, cause: e });
    }
    // HDS 8
    return { ...dtoOut, uuAppErrorMap };
  }

  async delete(awid, dtoIn, session, authorizationResult, uuAppErrorMap = {}) {
    //HDS 1.
    const jokesInstance = await this.daoMain.getByAwid(awid);

    //HDS 1.1
    if (jokesInstance.state !== "active") {
      throw new Errors.Instance.JokesInstanceNotInProperState(uuAppErrorMap, { dtoIn });
    }
    //HDS A1
    else if (!jokesInstance.state) {
      throw new Errors.Instance.JokesInstanceDoesNotExist(uuAppErrorMap, { dtoIn });
    }
    // HDS 2, 2.1
    let validationResult = this.validator.validate("jokeDeleteDtoInType", dtoIn);
    // HDS 2.2, 2.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // HDS 3
    let joke = await this.dao.get(awid, dtoIn.id);
    if (!joke) {
      throw new Errors.Delete.JokeDoesNotExist({ uuAppErrorMap }, { jokeId: dtoIn.id });
    }
    /////////////////////

    if (joke.jokePicCode) {
      try {
        await BinaryAbl.deleteBinary(awid, { code: joke.jokePicCode });
      } catch (e) {
        throw new Errors.Delete.BinaryDaoDeleteByCodeFailed({ uuAppErrorMap }, e);
      }
    }
    ///////////////////

    // HDS 4,
    if (
      session.getIdentity().getUuIdentity() !== joke.uuIdentity &&
      !authorizationResult.getAuthorizedProfiles().includes("Authorities")
    ) {
      throw new Errors.Delete.UserNotAuthorized({ uuAppErrorMap });
    }

    // HDS 7
    await this.dao.delete(awid, dtoIn.id);

    // HDS 8
    return { ...joke, uuAppErrorMap };
  }

  async list(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 1.
    const jokesInstance = await this.daoMain.getByAwid(awid);

    //HDS 1.1
    if (jokesInstance.state === "closed") {
      throw new Errors.Instance.JokesInstanceNotInProperState(uuAppErrorMap, { dtoIn });
    } else if (jokesInstance.state === "underConstruction") {
      throw new Errors.Instance.JokesInstanceIsUnderConstruction(uuAppErrorMap, { dtoIn });
    }
    //HDS A1
    else if (!jokesInstance.state) {
      throw new Errors.Instance.JokesInstanceDoesNotExist(uuAppErrorMap, { dtoIn });
    }
    // HDS 2, 2.1
    let validationResult = this.validator.validate("jokeListDtoInType", dtoIn);
    // HDS 2.2, 2.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    // HDS 2.4
    const { sortBy, order, pageInfo } = dtoIn;

    if (!sortBy) sortBy = defaultValues.sortBy;
    if (!order) order = defaultValues.order;
    if (!pageInfo) pageInfo = {};
    if (!pageInfo.pageSize) pageInfo.pageSize = defaultValues.pageSize;
    if (!pageInfo.pageIndex) pageInfo.pageIndex = defaultValues.pageIndex;

    let dtoOut;

    try {
      dtoOut = await this.dao.list(awid, dtoIn.sortBy, dtoIn.order, dtoIn.pageInfo);
    } catch (e) {
      throw new Error(e);
    }
    //HDS 4
    return { ...dtoOut, uuAppErrorMap };
  }

  async get(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 1.
    const jokesInstance = await this.daoMain.getByAwid(awid);

    //HDS 1.1
    if (jokesInstance.state === "closed") {
      throw new Errors.Instance.JokesInstanceNotInProperState(uuAppErrorMap, { dtoIn });
    } else if (jokesInstance.state === "underConstruction") {
      throw new Errors.Instance.JokesInstanceIsUnderConstruction(uuAppErrorMap, { dtoIn });
    }
    //HDS A1
    else if (!jokesInstance.state) {
      throw new Errors.Instance.JokesInstanceDoesNotExist(uuAppErrorMap, { dtoIn });
    }
    //HDS 2
    let validationResult = this.validator.validate("jokeGetDtoInType", dtoIn);
    //HDS 2.1.
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    //HDS 3
    let joke = await this.dao.get(awid, dtoIn.id);
    // let dtoOut = await this.dao.get(uuObject);

    //Binary
    let binaryImage = {};
    if (joke.jokePicCode) {
      try {
        binaryImage = await BinaryAbl.getBinary(awid, { code: joke.jokePicCode });
      } catch (e) {
        throw new Errors.Get.BinaryDoesNotExist({ uuAppErrorMap }, e);
      }
    }
    //////////

    return { ...joke, ...binaryImage, uuAppErrorMap };
  }

  async create(awid, dtoIn, uuAppErrorMap = {}) {
    //1.Loads the jokesInstance uuObject from the uuAppObjectStore through the jokesInstance DAO method getByAwid.
    const jokesInstance = await this.daoMain.getByAwid(awid);
    console.log("testfds");

    //1.1.Checks if jokesInstance is not in the Closed state.
    if (jokesInstance.state !== "active") {
      throw new Errors.Instance.JokesInstanceNotInProperState(uuAppErrorMap, { dtoIn });
    }
    //A1.the jokesInstance uuObject does not exist
    else if (!jokesInstance.state) {
      throw new Errors.Instance.JokesInstanceDoesNotExist(uuAppErrorMap, { dtoIn });
    }
    //2.Performs a logical check of dtoIn.

    //2.1.Calls the validate method on dtoIn according to dtoInType and fills validationResult with it.

    let validationResult = this.validator.validate("jokeCreateDtoInType", dtoIn);
    console.log(dtoIn);
    //2.2.Checks whether dtoIn contains keys beyond the scope of dtoInType.
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    console.log("validate3");
    //Binary
    const { image, ...restDtoIn } = {
      averageRating: 0,
      ratingCount: 0,
      visibility: false,
      uuIdentity: "uuIdentity of logged user",
      uuIdentityName: "name and surname of logged user",
      ...dtoIn,
    };
    let jokePic = null;
    console.log({ dtoIn });
    if (image) {
      try {
        jokePic = await BinaryAbl.createBinary(awid, { data: image });
      } catch (e) {
        console.log({ errsdf: JSON.stringify(e.paramMap) });
        throw new Errors.Create.CreateBinaryFailed({ uuAppErrorMap }, e);
      }
    }
    //   const uuObject = {
    //     awid,
    //     jokePicCode: jokePic.code,
    //     ...restDtoIn,
    //   };
    // }
    const uuObject = {
      awid,
      jokePicCode: jokePic.code,
      ...restDtoIn,
    };
    //2.4.Adds keys and values from Added Values table to dtoIn object.

    let dtoOut = null;

    //5.Creates the joke
    try {
      dtoOut = await this.dao.create(uuObject);
    } catch (e) {
      console.log({ efdfd: e });
      throw new Errors.Create.JokeDaoCreateFailed(uuAppErrorMap, { dtoIn, cause: e });
    }

    return { ...dtoOut, uuAppErrorMap };
    // }

    //////
  }
}

module.exports = new JokeAbl();
