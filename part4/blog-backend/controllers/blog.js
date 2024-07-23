const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
    const blog = new Blog(request.body);

    if (!blog.title || !blog.author || !blog.url) {
        response.status(400).json({ error: "Required parameter is missing" });
    } else {
        const newBlog = await blog.save();
        response.status(201).json(newBlog);
    }
});

blogRouter.delete("/:id", async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

blogRouter.put("/:id", async (request, response) => {
    const { title, author, url } = request.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url },
        { new: true, runValidators: true, context: "query" }
    );
    response.status(200).json(updatedBlog);
});

module.exports = blogRouter;
