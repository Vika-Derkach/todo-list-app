"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");

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
  pageIndex: 0,
  pageSize: 1000,
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item");
  }

  async list(awid, dtoIn, uuAppErrorMap = {}) {
    // HDS 1, 1.1
    let validationResult = this.validator.validate("listListDtoInType", dtoIn);
    // HDS 1.2, 1.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );
    // HDS 1.4.

    // TODO rev use let { pageInfo } - cmd fails in case of empty dtoIn,
    //  and you can have empty dtoIn by your validations (no required fields)
    const { pageInfo } = dtoIn;

    if (!pageInfo) pageInfo = {};
    if (!pageInfo.pageSize) pageInfo.pageSize = defaultValues.pageSize;
    if (!pageInfo.pageIndex) pageInfo.pageIndex = defaultValues.pageIndex;

    let dtoOut;
    // HDS 2
    try {
      dtoOut = await this.dao.list(awid, dtoIn.pageInfo);
    } catch (e) {
      throw new Error(e);
    }
    //HDS 4
    return { ...dtoOut, uuAppErrorMap };
  }

  async delete(awid, dtoIn, uuAppErrorMap = {}) {
    // HDS 2, 2.1
    let validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
    // HDS 2.2, 2.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // HDS 2
    const { itemList } = await this.itemDao.listByListAndCompleted({ awid, listId: dtoIn.id });

    let uuList = await this.dao.get(awid, dtoIn.id);
    if (!uuList) {
      throw new Errors.Delete.ListDoesNotExist({ uuAppErrorMap }, { listId: dtoIn.id });
    }
    // HDS 2.1 2.2
    if (dtoIn.forceDelete || itemList.length < 1) {
      if (itemList.length > 0) {
        try {
          await this.itemDao.deleteMany(awid, dtoIn.id);
        } catch (e) {
          throw new Errors.Delete.ItemDaoDeleteFailed({ uuAppErrorMap }, e);
        }
      }

      try {
        // HDS 3
        await this.dao.delete(awid, dtoIn.id);
      } catch (e) {
        throw new Errors.Delete.ListDaoDeleteFailed({ uuAppErrorMap }, e);
      }
      return { uuAppErrorMap, result: true };
    }

    // HDS 4
    return { uuAppErrorMap, result: false };
  }

  async update(awid, dtoIn, uuAppErrorMap = {}) {
    // HDS 1, 1.1
    let validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
    // HDS 1.2, 1.3,
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2 2.1
    let uuList = await this.dao.get(awid, dtoIn.id);

    // HDS A3
    if (!uuList) throw new Errors.Update.ListDoesNotExist(uuAppErrorMap, { id: dtoIn.id });
    let uuObject = { ...uuList, ...dtoIn };
    let dtoOut;

    try {
      // HDS 2.2
      dtoOut = await this.dao.update(uuObject);
    } catch (e) {
      throw new Errors.Update.ListDaoUpdateFailed(uuAppErrorMap, { dtoIn, cause: e });
    }
    // HDS 2.3.
    return { ...dtoOut, uuAppErrorMap };
  }

  async get(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 1, 1.1
    let validationResult = this.validator.validate("listGetDtoInType", dtoIn);
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
      throw Errors.Get.ListDoesNotExist(uuAppErrorMap, { id: dtoIn.id, cause: e });
    }
    // HDS 3
    return { ...uuObject, uuAppErrorMap };
  }

  async create(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 1, 1.1,
    let validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    //HDS  1.2, 1.3
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    //HDS 2
    const uuObject = {
      ...dtoIn,
      awid,
    };

    let dtoOut;

    try {
      dtoOut = await this.dao.create(uuObject);
    } catch (e) {
      throw Errors.Create.ListDaoCreateFailed(uuAppErrorMap, { dtoIn, cause: e });
    }
    //HDS 3
    return { ...dtoOut, uuAppErrorMap };
  }
}

module.exports = new ListAbl();
