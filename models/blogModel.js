module.exports = mongoose => {
    var blogSchema = mongoose.Schema(
      {
        blogId: String,
        title: String,
        description: String,
        blog: String,
      },
      { timestamps: true }
    );
  
    blogSchema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Blog = mongoose.model("Blog", blogSchema);
    return Blog;
  };