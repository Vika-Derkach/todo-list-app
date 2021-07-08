"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ code: 1, awaid: 1 }, { unique: true });
    await super.createIndex({ awid: 1, listId: 1 }, { completed: true });
  }
  async create(uuObject) {
    return await super.insertOne(uuObject);
  }
  async get(awid, id) {
    return await super.findOne({ awid, id });
  }
  async listByListAndCompleted(filter) {
    return await super.find(filter);
  }
  async listByListIdAndCompleted(filter, pageInfo) {
    return await super.find(filter, pageInfo);
  }

  async listByList(filter, pageInfo) {
    return await super.find(filter, pageInfo);
  }
  async listByCompleted(filter, pageInfo) {
    return await super.find(filter, pageInfo);
  }
  async update({ awid, id, ...uuObject }) {
    return await super.findOneAndUpdate({ awid, _id: id }, uuObject, null, null);
  }
  async delete(awid, id) {
    return await super.deleteOne({ awid, id });
  }
  async deleteMany(awid, listId) {
    return await super.deleteMany({ awid, listId });
  }
  async setCompleted({ awid, id, completed = true }) {
    return await super.findOneAndUpdate({ awid, _id: id }, { completed }, null, null);
  }
}

module.exports = ItemMongo;
