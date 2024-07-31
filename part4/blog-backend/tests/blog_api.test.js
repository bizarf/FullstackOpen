const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const User = require("../models/user");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");

const api = supertest(app);

describe("when there is initially some blogs saved", () => {
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

    describe("adding a new blog", () => {
        beforeEach(async () => {
            await User.deleteMany({});

            const passwordHash = await bcrypt.hash("secret", 10);
            const user = new User({
                username: "root",
                name: "admin",
                passwordHash,
            });

            await user.save();

            await api.post("/api/login").send({
                username: "root",
                password: "secret",
            });
        });

        test("a valid blog post can be added", async () => {
            const login = await api.post("/api/login").send({
                username: "root",
                password: "secret",
            });

            const newBlog = {
                title: "Getting started with CSS",
                author: "John Smith",
                url: "www.test.com",
            };

            await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${login.body.token}`)
                .send(newBlog)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const blogsAtEnd = await helper.blogsInDb();
            assert.strictEqual(
                blogsAtEnd.length,
                helper.initialBlogs.length + 1
            );

            const contents = blogsAtEnd.map((b) => b.title);

            assert(contents.includes("Getting started with CSS"));
        });

        test("no token is provided which returns a 401 error", async () => {
            const newBlog = {
                title: "",
                author: "John Smith",
                url: "www.test.com",
            };

            await api.post("/api/blogs").send(newBlog).expect(401);

            const blogsAtEnd = await helper.blogsInDb();

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
        });

        test("if likes is not provided, then default to 0", async () => {
            const login = await api.post("/api/login").send({
                username: "root",
                password: "secret",
            });

            const newBlog = {
                title: "Getting started with CSS",
                author: "John Smith",
                url: "www.test.com",
            };

            await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${login.body.token}`)
                .send(newBlog)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const blogsAtEnd = await helper.blogsInDb();
            assert.strictEqual(
                blogsAtEnd.length,
                helper.initialBlogs.length + 1
            );

            const newBlogPost = blogsAtEnd.find(
                (blog) => blog.title === "Getting started with CSS"
            );

            assert.strictEqual(newBlogPost.likes, 0);
        });

        test("blog without title is not added", async () => {
            const login = await api.post("/api/login").send({
                username: "root",
                password: "secret",
            });

            const newBlog = {
                title: "",
                author: "John Smith",
                url: "www.test.com",
            };

            await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${login.body.token}`)
                .send(newBlog)
                .expect(400);

            const blogsAtEnd = await helper.blogsInDb();

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
        });

        test("blog without url is not added", async () => {
            const login = await api.post("/api/login").send({
                username: "root",
                password: "secret",
            });

            const newBlog = {
                title: "Flexbox is great",
                author: "John Smith",
                url: "",
            };

            await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${login.body.token}`)
                .send(newBlog)
                .expect(400);

            const blogsAtEnd = await helper.blogsInDb();

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
        });
    });

    describe("deleting a blog", () => {
        beforeEach(async () => {
            await User.deleteMany({});

            const passwordHash = await bcrypt.hash("secret", 10);
            const user = new User({
                username: "root",
                name: "admin",
                passwordHash,
            });

            await user.save();

            await api.post("/api/login").send({
                username: "root",
                password: "secret",
            });
        });

        test("succeeds if the id is valid", async () => {
            const login = await api.post("/api/login").send({
                username: "root",
                password: "secret",
            });

            const newBlog = {
                title: "Getting started with CSS",
                author: "John Smith",
                url: "www.test.com",
            };

            await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${login.body.token}`)
                .send(newBlog)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const blogsAtStart = await helper.blogsInDb();

            const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set("Authorization", `Bearer ${login.body.token}`)
                .expect(204);

            const blogsAtEnd = await helper.blogsInDb();

            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

            const contents = blogsAtEnd.map((r) => r.title);
            assert(!contents.includes(blogToDelete.title));
        });
    });

    describe("updating a blog post", () => {
        test("successfully updates a blog post", async () => {
            const login = await api.post("/api/login").send({
                username: "root",
                password: "secret",
            });

            const newBlog = {
                title: "Getting started with CSS",
                author: "John Smith",
                url: "www.test.com",
            };

            await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${login.body.token}`)
                .send(newBlog)
                .expect(201)
                .expect("Content-Type", /application\/json/);

            const blogsAtStart = await helper.blogsInDb();
            const blogToUpdate = blogsAtStart[blogsAtStart.length - 1];

            const updatedBlog = {
                title: "Flexbox is great",
                author: "John Smith",
                url: "www.test.com",
                likes: 20,
            };

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set("Authorization", `Bearer ${login.body.token}`)
                .send(updatedBlog)
                .expect(200);

            const blogsAtEnd = await helper.blogsInDb();
            assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);

            const contents = blogsAtEnd.map((b) => b.title);

            assert(contents.includes("Flexbox is great"));
        });
    });
});

describe("where there is initially one user in the db", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("secret", 10);
        const user = new User({
            username: "root",
            name: "admin",
            passwordHash,
        });

        await user.save();
    });

    test("creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "mluukkai",
            name: "Matti Luukkainen",
            password: "salainen",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map((u) => u.username);
        assert(usernames.includes(newUser.username));
    });

    test("creation fails with proper statuscode and message if username already taken", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "salainen",
        };

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();

        assert(result.body.error.includes("expected `username` to be unique"));

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if username is less than 3 characters", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "ab",
            name: "Test",
            password: "tpggfdjg34",
        };

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        console.log(result.body.error);
        assert(
            result.body.error.includes(
                "expected `username` to be at least three characters"
            )
        );

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("creation fails with proper statuscode and message if password is less than 3 characters", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "afrb",
            name: "Test",
            password: "aa",
        };

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        console.log(result.body.error);
        assert(
            result.body.error.includes(
                "expected `password` to be at least 3 characters"
            )
        );

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
});

after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});
