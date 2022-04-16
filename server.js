const express = require('express')
const app = express()
const axios = require('axios');
const cors = require('cors');
const fs = require('fs')
app.use(express.json());
app.use(express.urlencoded());

const db = require("./models");

// ******************************************* DB CONNECTION ******************************************
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("database Connected!");
  })
  .catch(err => {
    console.log("Unable to connect !", err);
    process.exit();
  });


var corsOptions = {
    origin: "*",
};

//body (request)
app.use(express.json())
app.use(cors(corsOptions))
const Blog = db.Blogs;
//view/assets
app.set("view engine", "ejs")
app.use(express.static('assets'));

//open listener port
app.listen(5000, () => {
    console.log('Port 5000')
})
// ****************************************** CONSUMING GET REQUEST FETCHING ALL BLOGS IN UI******************************************

//get all blog list
app.get('/', (req, res) => {
    axios.get('http://localhost:5000/blog/list')
        .then(function(response) {
            // return index and passs blogs as argument (list)
            res.render('index', { blogs: response.data });
        })
        .catch(err => {
            res.send(err);
        })

})

// ****************************************** API TO GET ALL BLOGS FROM MONGODB ******************************************

app.get('/blog/list', (req, res) => {

   // fetching All the blogs from database
   Blog.find()
   .then(data => {
       res.send(data)
   })
   .catch(err => {
       res.status(500).send({
       message:
           err.message || "Some error occurred while retrieving Blogs."
       });
   });

})
