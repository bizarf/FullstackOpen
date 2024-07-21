const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
});

describe("total likes", () => {
    const listWithMultipleBlogs = [
        {
            title: "Post One",
            author: "Joe Bloggs",
            url: "www.test.com",
            likes: 50,
        },
        {
            title: "Post Twp",
            author: "Joe Bloggs",
            url: "www.test.com",
            likes: 20,
        },
        {
            title: "Post Three",
            author: "Joe Bloggs",
            url: "www.test.com",
            likes: 10,
        },
    ];

    test("of empty list is zero", () => {
        assert.strictEqual(listHelper.totalLikes([]), 0);
    });

    test("when list has only one blog equals the likes of that", () => {
        assert.strictEqual(
            listHelper.totalLikes([
                {
                    title: "Post One",
                    author: "Joe Bloggs",
                    url: "www.test.com",
                    likes: 50,
                },
            ]),
            50
        );
    });

    test("of a bigger list calculated right", () => {
        assert.strictEqual(listHelper.totalLikes(listWithMultipleBlogs), 80);
    });
});

describe("favourite blog", () => {
    const listWithMultipleBlogs = [
        {
            title: "Post One",
            author: "Joe Bloggs",
            url: "www.test.com",
            likes: 50,
        },
        {
            title: "Post Twp",
            author: "Joe Bloggs",
            url: "www.test.com",
            likes: 20,
        },
        {
            title: "Post Three",
            author: "Joe Bloggs",
            url: "www.test.com",
            likes: 10,
        },
    ];

    test("of a bigger list calculated right", () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(listWithMultipleBlogs), {
            title: "Post One",
            author: "Joe Bloggs",
            likes: 50,
        });
    });
});
