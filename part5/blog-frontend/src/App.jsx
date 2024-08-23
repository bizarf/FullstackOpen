import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification ";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import { useRef } from "react";
import LoginForm from "./components/LoginForm";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [notification, setNotification] = useState(null);
    const [user, setUser] = useState(null);
    const blogFormRef = useRef();

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

    const handleLogin = async (userObject) => {
        try {
            // user object to send to the login function
            const user = await loginService.login(userObject);

            // save the returned object into local storage if it's valid
            window.localStorage.setItem(
                "loggedBlogappUser",
                JSON.stringify(user)
            );
            blogService.setToken(user.token);
            setUser(user);
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

    const handleNewBlog = async (blogObject) => {
        try {
            const newBlog = await blogService.create(blogObject);

            if (newBlog) {
                blogFormRef.current.toggleVisibility();
                setNotification({
                    type: "success",
                    message: `a new blog. ${newBlog.title} by ${newBlog.author} added`,
                });
                setTimeout(() => {
                    setNotification(null);
                }, 5000);
                // copy the array and add the above newBlog object to the array
                setBlogs([...blogs, newBlog]);
            }
        } catch (error) {
            setNotification({ type: "error", message: "Something went wrong" });
            setTimeout(() => {
                setNotification(null);
            }, 5000);

            if (error.response.data.error === "token expired") {
                setNotification({
                    type: "error",
                    message: "Please login again",
                });
                setTimeout(() => {
                    setNotification(null);
                    setUser(null);
                }, 5000);
            }
        }
    };

    const handleLike = async (id, blogObject) => {
        try {
            const addLike = await blogService.addLike(id, blogObject);

            setBlogs(blogs.map((blog) => (blog.id !== id ? blog : addLike)));
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id, title, author) => {
        const deletePrompt = confirm(`Remove blog: ${title} by ${author}`);
        if (deletePrompt) {
            try {
                const remove = await blogService.remove(id);
                if (remove.success) {
                    setBlogs(blogs.filter((b) => b.id !== id));
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    // render a login form if the user state is null
    if (!user) {
        return (
            <LoginForm handleLogin={handleLogin} notification={notification} />
        );
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification notification={notification} />
            <div>
                <p>{user.name} logged in</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                <BlogForm handleNewBlog={handleNewBlog} />
            </Togglable>
            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        handleLike={handleLike}
                        handleDelete={handleDelete}
                        user={user}
                    />
                ))}
        </div>
    );
};

export default App;
