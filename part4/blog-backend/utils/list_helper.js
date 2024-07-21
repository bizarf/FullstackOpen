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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
};
