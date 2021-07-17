"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ code: 1, awaid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }
  async get(awid, id) {
    return await super.findOne({ awid, id });
  }
  async list(awid, sortBy, order, pageInfo) {
    let sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };
    return await super.find({ awid }, pageInfo, sort);
  }
  async delete(awid, id, session, authorizationResult) {
    return await super.deleteOne({ awid, id, session, authorizationResult });
  }
  async update({ awid, id, ...uuObject }) {
    return await super.findOneAndUpdate({ awid, _id: id }, uuObject, null, null);
  }
}

module.exports = JokeMongo;
