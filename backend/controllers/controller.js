const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

class Controller {
  constructor(DBModel) {
    this.DBModel = DBModel;
  }

  create(data, callback) {
    this.DBModel.create(data, (err, res) => callback(err, res));
  }

  getAll(callback) {
    this.DBModel.find({}, (err, res) => callback(err, res));
  }
  find(id, callback) {
    this.DBModel.findOne({ _id: ObjectId(id) }, (err, res) =>
      callback(err, res)
    );
  }
  update(id, data, callback) {
    this.DBModel.update({ _id: ObjectId(id) }, { $set: data }, (err, res) =>
      callback(err, res)
    );
  }
  delete(id, callback) {
    this.DBModel.deleteOne({ _id: ObjectId(id) }, (err, res) =>
      callback(err, res)
    );
  }
}

module.exports = Controller;
