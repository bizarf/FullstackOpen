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

module.exports = blogRouter;
