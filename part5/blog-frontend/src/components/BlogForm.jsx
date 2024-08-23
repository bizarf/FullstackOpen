import { useState } from "react";

const BlogForm = ({ handleNewBlog }) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const addBlog = (e) => {
        e.preventDefault();

        // send a blog object to the handleNewBlog function which makes the post request
        handleNewBlog({
            title,
            author,
            url,
        });

        // reset the inputs
        setTitle("");
        setAuthor("");
        setUrl("");
    };

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={addBlog}>
                <div>
                    Title
                    <input
                        type="text"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        placeholder="Title"
                    />
                </div>
                <div>
                    Author
                    <input
                        type="text"
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                        placeholder="Author"
                    />
                </div>
                <div>
                    Url
                    <input
                        type="text"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                        placeholder="Url"
                    />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default BlogForm;
