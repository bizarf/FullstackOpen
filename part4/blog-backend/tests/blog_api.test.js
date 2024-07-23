const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
});

test("blogs are returned in JSON", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("there are three blogs", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("the unique identifier is id and not _id", async () => {
    const response = await api.get("/api/blogs");

    response.body.forEach((blog) => {
        assert.notStrictEqual(blog.id, undefined);
        assert.strictEqual(blog._id, undefined);
    });
});

test("a valid blog post can be added", async () => {
    const newBlog = {
        title: "Getting started with CSS",
        author: "John Smith",
        url: "www.test.com",
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((n) => n.title);

    assert(contents.includes("Getting started with CSS"));
});

test("if likes is not provided, then default to 0", async () => {
    const newBlog = {
        title: "Getting started with CSS",
        author: "John Smith",
        url: "www.test.com",
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const newBlogPost = blogsAtEnd.find(
        (blog) => blog.title === "Getting started with CSS"
    );

    assert.strictEqual(newBlogPost.likes, 0);
});

test("blog without title is not added", async () => {
    const newBlog = {
        title: "",
        author: "John Smith",
        url: "www.test.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDB();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("blog without url is not added", async () => {
    const newBlog = {
        title: "Flexbox is great",
        author: "John Smith",
        url: "",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDB();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

after(async () => {
    await mongoose.connection.close();
});
