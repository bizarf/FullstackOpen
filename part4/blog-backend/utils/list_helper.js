const lodash = require("lodash");

const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const result = blogs.reduce((a, post) => {
        return a + post.likes;
    }, 0);
    return result;
};

const favoriteBlog = (blogs) => {
    const result = blogs.reduce((a, post) => {
        return Math.max(a, post.likes);
    }, -Infinity);

    const post = blogs.find((post) => post.likes === result);

    return {
        title: post.title,
        author: post.author,
        likes: post.likes,
    };
};

const mostBlogs = (blogs) => {
    const count = lodash.countBy(blogs, "author");

    const highest = Object.keys(count).reduce((a, b) =>
        count[a] > count[b] ? a : b
    );

    const result = {
        author: highest,
        blogs: count[highest],
    };

    return result;
};

const mostLikes = (blogs) => {
    const count = lodash.maxBy(blogs, "likes");

    const result = {
        author: count.author,
        likes: count.likes,
    };

    return result;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
