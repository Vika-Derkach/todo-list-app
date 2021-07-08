"use strict";

const JokesMainUseCaseError = require("./jokes-main-use-case-error.js");
const ITEM_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}item/`;

const Create = {
  UC_CODE: `${ITEM_ERROR_PREFIX}create/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ItemDaoCreateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemDaoCreateFailed`;
      this.message = "Add item by item DAO create failed.";
    }
  },
  ListDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },
};

const Get = {
  UC_CODE: `${ITEM_ERROR_PREFIX}get/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ItemDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },
};

const Update = {
  UC_CODE: `${ITEM_ERROR_PREFIX}update/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ListDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },
  ItemDaoUpdateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDaoUpdateFailed`;
      this.message = "Update item by item DAO update failed.";
    }
  },
  ItemDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },
};

const Complete = {
  UC_CODE: `${ITEM_ERROR_PREFIX}complete/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Complete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ItemDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Complete.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },
  ItemDaoSetCompletedFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Complete.UC_CODE}itemDaoSetCompletedFailed`;
      this.message = "Update item by item DAO setCompleted failed.";
    }
  },
};

const Delete = {
  UC_CODE: `${ITEM_ERROR_PREFIX}delete/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ItemDaoDeleteFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemDaoDeleteFailed`;
      this.message = "Delete item by item DAO delete failed.";
    }
  },
};

const List = {
  UC_CODE: `${ITEM_ERROR_PREFIX}list/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

module.exports = {
  List,
  Delete,
  Complete,
  Update,
  Get,
  Create,
};
