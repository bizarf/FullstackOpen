import { useEffect, useRef, useState } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import Notification from "./components/Notification ";
import Footer from "./components/Footer";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [loginVisible, setLoginVisible] = useState(false);
    const noteFormRef = useRef();

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes);
        });
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            noteService.setToken(user.token);
        }
    }, []);

    const loginForm = () => {
        const hideWhenVisible = { display: loginVisible ? "none" : "" };
        const showWhenVisible = { display: loginVisible ? "" : "none" };

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>
                        log in
                    </button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) =>
                            setUsername(target.value)
                        }
                        handlePasswordChange={({ target }) =>
                            setPassword(target.value)
                        }
                        handleSubmit={handleLogin}
                    />
                    <button onClick={() => setLoginVisible(false)}>
                        cancel
                    </button>
                </div>
            </div>
        );
    };

    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility();
        noteService.create(noteObject).then((returnedNote) => {
            setNotes([...notes, returnedNote]);
        });
    };

    const notesToShow = showAll
        ? notes
        : notes.filter((note) => note.important === true);

    const toggleImportanceOf = (id) => {
        const note = notes.find((n) => n.id === id);
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then((returnedNote) => {
                setNotes(
                    notes.map((note) => (note.id !== id ? note : returnedNote))
                );
            })
            .catch((err) => {
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                );
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
                setNotes(notes.filter((n) => n.id !== id));
            });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const user = await loginService.login({
                username,
                password,
            });

            window.localStorage.setItem(
                "loggedNoteappUser",
                JSON.stringify(user)
            );
            noteService.setToken(user.token);
            setUser(user);
            setUsername("");
            setPassword("");
        } catch (error) {
            setErrorMessage("Wrong credentials");
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />

            {user === null ? (
                loginForm()
            ) : (
                <div>
                    <p>{user.name} logged in</p>
                    <Togglable buttonLabel="new note" ref={noteFormRef}>
                        <NoteForm createNote={addNote} />
                    </Togglable>
                </div>
            )}

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notesToShow.map((note) => (
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                ))}
            </ul>

            <Footer />
        </div>
    );
};

export default App;
