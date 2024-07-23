const Blog = require("../models/blog");

const initialBlogs = [
    {
        title: "How to learn JavaScript",
        author: "John Smith",
        url: "www.test.com",
        likes: 34,
    },
    {
        title: "How to learn Python",
        author: "Kate Arrow",
        url: "www.test.com",
        likes: 13,
    },
    {
        title: "Array methods",
        author: "Zara Tan",
        url: "www.test.com",
        likes: 73,
    },
];

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

module.exports = {
    initialBlogs,
    blogsInDb,
};
