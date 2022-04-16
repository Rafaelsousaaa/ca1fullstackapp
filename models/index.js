const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = "mongodb+srv://Rafaelsousaa:Rafaelsousaa@cluster0.wa6io.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
db.Blogs = require("./blogModel.js")(mongoose);

module.exports = db;