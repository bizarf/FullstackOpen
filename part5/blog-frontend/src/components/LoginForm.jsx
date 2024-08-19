import { useState } from "react";
import Notification from "./Notification ";

const LoginForm = ({ handleLogin, notification }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const sendLogin = (e) => {
        e.preventDefault();

        // send the user details in an object to a function that is on App.jsx which sends the details to the backend
        handleLogin({ username, password });
        // clear inputs
        setUsername("");
        setPassword("");
    };

    return (
        <div>
            <h2>Log in to the application</h2>
            <Notification notification={notification} />
            <form onSubmit={sendLogin}>
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
};

export default LoginForm;
