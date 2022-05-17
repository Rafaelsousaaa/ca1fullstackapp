const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = "";
db.Blogs = require("./blogModel.js")(mongoose);

module.exports = db;
