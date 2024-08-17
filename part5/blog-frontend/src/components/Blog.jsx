import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete }) => {
    const [blogDetail, setBlogDetail] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    };

    const toggleBlogDetail = () => {
        setBlogDetail((state) => !state);
    };

    const addLike = async (id) => {
        const updatedBlogPost = {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes,
            user: blog.user,
        };

        handleLike(id, updatedBlogPost);
    };

    return (
        <div style={blogStyle}>
            {blog.title} {blog.author}
            {!blogDetail ? (
                <>
                    <button onClick={toggleBlogDetail}>view</button>
                </>
            ) : (
                <>
                    <button onClick={toggleBlogDetail}>hide</button>
                    <ul>
                        <li>
                            <a href={blog.url}>{blog.url}</a>
                        </li>
                        <li>{blog.id}</li>
                        <li>
                            likes {blog.likes}{" "}
                            <button onClick={() => addLike(blog.id)}>
                                like
                            </button>
                        </li>
                        <li>{blog.user[0].name}</li>
                        <button
                            onClick={() =>
                                handleDelete(blog.id, blog.title, blog.author)
                            }
                        >
                            remove
                        </button>
                    </ul>
                </>
            )}
        </div>
    );
};

export default Blog;
