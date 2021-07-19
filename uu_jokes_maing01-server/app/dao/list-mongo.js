"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ code: 1, awaid: 1 }, { unique: true });
    // TODO rev: do not leave commented code
    // await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }
  async get(awid, id) {
    return await super.findOne({ awid, id });
  }
  async update({ awid, id, ...uuObject }) {
    return await super.findOneAndUpdate({ awid, _id: id }, uuObject, null, null);
  }
  async delete(awid, id) {
    return await super.deleteOne({ awid, id });
  }
  async list(awid, pageInfo) {
    return await super.find({ awid }, pageInfo);
  }
}

module.exports = ListMongo;
