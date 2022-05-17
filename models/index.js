const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
require('dotenv').config();

const db = {};
db.mongoose = mongoose;
db.url =process.env.MONGODB; ;
db.Blogs = require("./blogModel.js")(mongoose);

module.exports = db;
