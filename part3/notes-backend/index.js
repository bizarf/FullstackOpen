require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const Note = require("./models/note");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true,
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false,
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
];

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
});

// fetch all notes
app.get("/api/notes", (req, res) => {
    Note.find({}).then((notes) => {
        res.json(notes);
    });
});

// fetch a single note
app.get("/api/notes/:id", (req, res, next) => {
    Note.findById(req.params.id)
        .then((note) => {
            if (note) {
                res.json(note);
            } else {
                res.status(404).end();
            }
        })
        .catch((err) => {
            next(err);
        });
});

// delete a note
app.delete("/api/notes/:id", (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(204).end();
        })
        .catch((err) => next(err));
});

// add a note
app.post("/api/notes", (req, res, next) => {
    const body = req.body;

    if (!body.content) {
        return res.status(400).json({
            error: "content missing",
        });
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });

    note.save()
        .then((savedNote) => {
            res.json(savedNote);
        })
        .catch((err) => next(err));
});

// update note
app.put("/api/notes/:id", (req, res, next) => {
    const { content, important } = req.body;

    Note.findByIdAndUpdate(
        req.params.id,
        { content, important },
        { new: true, runValidators: true, context: "query" }
    )
        .then((updatedNote) => {
            res.json(updatedNote);
        })
        .catch((err) => next(err));
});

// 404 message for when a user tries to go to a route that doesn't exist
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    }

    next(err);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
