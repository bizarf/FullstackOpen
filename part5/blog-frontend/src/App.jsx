import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification ";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState(null);
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    // fetches all blogs
    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    // signs the user in automatically if a valid token is in the local storage
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // user object to send to the login function
            const user = await loginService.login({
                username,
                password,
            });

            // save the returned object into local storage if it's valid
            window.localStorage.setItem(
                "loggedBlogappUser",
                JSON.stringify(user)
            );
            blogService.setToken(user.token);
            setUser(user);
            setUsername("");
            setPassword("");
        } catch (error) {
            setNotification({
                type: "error",
                message: "Wrong username or password",
            });
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    };

    const handleLogout = () => {
        window.localStorage.removeItem("loggedBlogappUser");
        setUser(null);
    };

    const handleNewBlog = async (e) => {
        e.preventDefault();

        try {
            const newBlog = await blogService.create({
                title,
                author,
                url,
            });

            if (newBlog) {
                setNotification({
                    type: "success",
                    message: `a new blog. ${title} by ${author} added`,
                });
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
                // copy the array and add the above newBlog object to the array
                setBlogs([...blogs, newBlog]);
                // reset the inputs
                setTitle("");
                setAuthor("");
                setUrl("");
            }
        } catch (error) {
            setNotification({ type: "error", message: "Something went wrong" });
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    };

    // render a login form if the user state is null
    if (!user) {
        return (
            <div>
                <h2>Log in to the application</h2>
                <Notification notification={notification} />
                <form onSubmit={handleLogin}>
                    <div>
                        Username
                        <input
                            type="text"
                            value={username}
                            name="username"
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification notification={notification} />
            <div>
                <p>{user.name} logged-in</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div>
                <h3>create new</h3>
                <form onSubmit={handleNewBlog}>
                    <div>
                        Title
                        <input
                            type="text"
                            value={title}
                            onChange={({ target }) => setTitle(target.value)}
                        />
                    </div>
                    <div>
                        Author
                        <input
                            type="text"
                            value={author}
                            onChange={({ target }) => setAuthor(target.value)}
                        />
                    </div>
                    <div>
                        Url
                        <input
                            type="text"
                            value={url}
                            onChange={({ target }) => setUrl(target.value)}
                        />
                    </div>
                    <button type="submit">Create</button>
                </form>
            </div>
            {blogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
            ))}
        </div>
    );
};

export default App;
