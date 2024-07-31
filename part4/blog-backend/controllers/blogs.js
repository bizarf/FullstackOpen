const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
    });
    response.json(blogs);
});

blogRouter.post("/", middleware.userExtractor, async (request, response) => {
    const body = request.body;
    const user = request.user;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        user: user.id,
    });

    const newBlog = await blog.save();
    user.blogs = [...user.blogs, newBlog._id];
    await user.save();
    response.status(201).json(newBlog);
});

blogRouter.delete(
    "/:id",
    middleware.userExtractor,
    async (request, response) => {
        const blog = await Blog.findById(request.params.id);
        const user = request.user;

        const blogUserId = blog.user[0]._id.toString();

        if (blogUserId === user.id) {
            await Blog.findByIdAndDelete(request.params.id);
            response.status(204).end();
        } else {
            return response.status(401).json({ error: "unauthorised user" });
        }
    }
);

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
