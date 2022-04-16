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
// ****************************************** CONSUMING UPDATE API DISPLAYING UPDATE PAGE IN EJS******************************************


//update blog
app.get('/update-blog/', (req, res) => {
    axios.get('http://localhost:5000/update-blog/:blogid')
        .then(function(response) {
            //console.log(finds)
            res.render('update_blog', {
                blogId: req.query.blogId,
                blog: req.query.blog,
                description: req.query.description,
                title: req.query.title
            })

        })
        .catch(err => {
            res.send(err);
        })

})

// ****************************************** UPDATING THE BLOG API******************************************

app.get('/update-blog/:blogid', (req, res) => {
    //params
    const id = req.params.blogid

    //check if it exists    
    Blog.find({id:id}).then(data => {
        if(data){
                res.send(data[0])     
        }else{ 
            res.status(404).send({ message : "No Blog With ID ["+ username+"]"})
            
        }
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || " Error Occured"
        });
    });
})



// ****************************************** UPDATING THE BLOG API******************************************


//update
app.put('/blog/update/:blogId', (req, res) => {
  //get the id from url
  const blogId = req.params.blogId
  //get the update data
  const blogData = req.body
    Blog.update({blogId:blogId},blogData).then(data=>{
            res.send(data)
        }).catch(err=>{
            return res.status(409).send({error: true, msg: 'blog id not exist'})
        })
  
})
// ****************************************** ADDING NEW BLOG API******************************************

//post add
app.post('/blog/add', (req, res) => {

    //get data

    const blogData = req.body

    // Finding Out if blog with given BlogId Already Exists
    Blog.find({blogId: blogData.blogId})
    .then(allBlogs => {
        // looking for blog data if already exists
        const findExist = allBlogs.find( blog => blog.blogId === blogData.blogId )
        if (findExist) {
            return res.status(409).send({error: true, msg: 'blogId already exist'})
        }else{
            let entry =new Blog(blogData)
            entry
            .save(entry)
            .then(data => {
                res.redirect('/');

            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Entry."
            });
            });
        }


    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Entrys."
        });
    });


})


// ****************************************** DELETING THE BLOG API******************************************

//delete
app.delete('/blog/delete/:blogId', (req, res) => {
    const blogId = req.params.blogId
    //finding blog by username and deleting the blog
     Blog.deleteOne({blogId :blogId}).then(data=>{
        // deleting blog
        console.log("Blog deleted successfully blog id [ "+ blogId +"]")
        res.send({success: true, msg: 'Post removed successfully'})
    }).catch(err=>{
        return res.status(409).send({error: true, msg: 'blog id does not exist'})
    }) 
    

})
