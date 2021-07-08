"use strict";

const JokesMainUseCaseError = require("./jokes-main-use-case-error.js");
const LIST_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}list/`;

const Create = {
  UC_CODE: `${LIST_ERROR_PREFIX}create/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ListDaoCreateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoCreateFailed`;
      this.message = "Add list by list DAO create failed.";
    }
  },
};

const Get = {
  UC_CODE: `${LIST_ERROR_PREFIX}get/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ListDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },
};

const Update = {
  UC_CODE: `${LIST_ERROR_PREFIX}update/`,
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
  ListDaoUpdateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}listDaoUpdateFailed`;
      this.message = "Update list by list DAO update failed.";
    }
  },

  // ListDoesNotExist: class extends JokesMainUseCaseError {
  //   constructor() {
  //     super(...arguments);
  //     this.code = `${Update.UC_CODE}listDoesNotExist`;
  //     this.message = "List with given id does not exist.";
  //   }
  // },
};

const Delete = {
  UC_CODE: `${LIST_ERROR_PREFIX}delete/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ListNotEmpty: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listNotEmpty`;
      this.message = "The list contains items.";
    }
  },
  ListDaoDeleteFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listDaoDeleteFailed`;
      this.message = "Delete list by list DAO delete failed.";
    }
  },
  ItemDaoDeleteFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemDaoDeleteFailed`;
      this.message = "Delete item by item DAO delete failed.";
    }
  },
  ListDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemDaoDeleteFailed`;
      this.message = "Delete item by item DAO delete failed.";
    }
  },
  ListWasNotFound: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listWasNotFound`;
      this.message = "List was not Found";
    }
  },
};

const List = {
  UC_CODE: `${LIST_ERROR_PREFIX}list/`,
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
  Update,
  Get,
  Create,
};
