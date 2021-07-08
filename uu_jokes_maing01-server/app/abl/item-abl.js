"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");

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
  completeUnsupportedKeys: {
    code: `${Errors.Complete.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
};
const defaultValues = {
  pageIndex: 0,
  pageSize: 1000,
};

class ItemAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("item");
    this.daoList = DaoFactory.getDao("list");
  }

  async list(awid, dtoIn, uuAppErrorMap = {}) {
    // HDS 1, 1.1
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    // HDS 1.2, 1.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    // HDS 1.4.
    const { pageInfo } = dtoIn;

    if (!pageInfo) pageInfo = {};
    if (!pageInfo.pageSize) pageInfo.pageSize = defaultValues.pageSize;
    if (!pageInfo.pageIndex) pageInfo.pageIndex = defaultValues.pageIndex;

    let dtoOut;

    // HDS 2
    // HDS 2.1
    if (dtoIn.hasOwnProperty("listId") && dtoIn.hasOwnProperty("completed")) {
      try {
        dtoOut = await this.dao.listByListIdAndCompleted(
          {
            awid,
            listId: dtoIn.listId,
            completed: dtoIn.completed,
          },
          dtoIn.pageInfo
        );
      } catch (e) {
        throw new Error(e);
      }
    }
    // HDS 2.2
    if (dtoIn.hasOwnProperty("listId") && !dtoIn.hasOwnProperty("completed")) {
      try {
        dtoOut = await this.dao.listByList(
          {
            awid,
            listId: dtoIn.listId,
          },
          dtoIn.pageInfo
        );
      } catch (e) {
        throw new Error(e);
      }
    }
    // HDS 2.3
    if (dtoIn.hasOwnProperty("completed") && !dtoIn.hasOwnProperty("listId")) {
      try {
        dtoOut = await this.dao.listByCompleted(
          {
            awid,
            completed: dtoIn.completed,
          },
          dtoIn.pageInfo
        );
      } catch (e) {
        throw new Error(e);
      }
    }

    //HDS 4
    return { ...dtoOut, uuAppErrorMap };
  }

  async delete(awid, dtoIn, uuAppErrorMap = {}) {
    // HDS 1, 1.1
    let validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    // HDS 1.2, 1.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // HDS 2
    try {
      await this.dao.delete(awid, dtoIn.id);
    } catch (e) {
      throw new Errors.Delete.ItemDaoDeleteFailed({ uuAppErrorMap }, e);
    }

    // HDS 3
    return { uuAppErrorMap };
  }

  async complete(awid, dtoIn, uuAppErrorMap = {}) {
    // HDS 1, 1.1
    let validationResult = this.validator.validate("itemCompleteDtoInType", dtoIn);
    // HDS 1.2, 1.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.completeUnsupportedKeys.code,
      Errors.Complete.InvalidDtoIn
    );

    // HDS 2
    let uuList = await this.dao.get(awid, dtoIn.id);
    // HDS A3
    if (!uuList) throw new Errors.Complete.ItemDoesNotExist(uuAppErrorMap, { dtoIn });
    // HDS 1.4
    let uuObject = { ...uuList, completed: true, ...dtoIn };
    let dtoOut;

    try {
      // HDS 4
      dtoOut = await this.dao.setCompleted(uuObject);
    } catch (e) {
      throw new Errors.Complete.ItemDaoSetCompletedFailed(uuAppErrorMap, { dtoIn, cause: e });
    }
    // HDS 5
    return { ...dtoOut, uuAppErrorMap };
  }

  async update(awid, dtoIn, uuAppErrorMap = {}) {
    // HDS 1, 1.1
    let validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
    // HDS 1.2, 1.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    //HDS 3
    let list = await this.daoList.get(awid, dtoIn.listId);
    //HDS A4
    if (dtoIn.listId != list.id) {
      throw new Errors.Update.ListDoesNotExist(uuAppErrorMap, { dtoIn });
    }
    // HDS 2
    let uuList = await this.dao.get(awid, dtoIn.id);
    // HDS A3
    if (!uuList) throw new Errors.Update.ItemDoesNotExist(uuAppErrorMap, { dtoIn });
    let uuObject = { ...uuList, ...dtoIn };
    let dtoOut;

    try {
      // HDS 4
      dtoOut = await this.dao.update(uuObject);
    } catch (e) {
      throw new Errors.Update.ItemDaoUpdateFailed(uuAppErrorMap, { dtoIn, cause: e });
    }
    // HDS 5
    return { ...dtoOut, uuAppErrorMap };
  }

  async get(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 1, 1.1,
    let validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    //HDS  1.2, 1.3
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    //HDS 2
    let uuObject;
    try {
      uuObject = await this.dao.get(awid, dtoIn.id);
    } catch (e) {
      throw Errors.Get.ItemDoesNotExist(uuAppErrorMap, { dtoIn, cause: e });
    }
    //HDS 3
    return { ...uuObject, uuAppErrorMap };
  }

  async create(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 1, 1.1,
    let validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    //HDS  1.2, 1.3
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    //HDS 3
    const uuObject = {
      completed: false,
      ...dtoIn,
      awid,
    };

    let list = await this.daoList.get(awid, dtoIn.listId);

    //HDS 2
    if (dtoIn.listId != list.id) {
      throw new Errors.Create.ListDoesNotExist(uuAppErrorMap, { dtoIn });
    }
    //HDS 4
    let dtoOut;
    try {
      dtoOut = await this.dao.create(uuObject);
    } catch (e) {
      //HDS A4
      throw Errors.Create.ItemDaoCreateFailed(uuAppErrorMap, { dtoIn, cause: e });
    }
    //HDS 5
    return { ...dtoOut, uuAppErrorMap };
  }
}

module.exports = new ItemAbl();
