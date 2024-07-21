const notesRouter = require("express").Router();
const Note = require("../models/note");

// fetch all notes
notesRouter.get("/", (req, res) => {
    Note.find({}).then((notes) => {
        res.json(notes);
    });
});

// fetch a single note
notesRouter.get("/:id", (req, res, next) => {
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
notesRouter.delete("/:id", (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(204).end();
        })
        .catch((err) => next(err));
});

// add a note
notesRouter.post("/", (req, res, next) => {
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
notesRouter.put("/:id", (req, res, next) => {
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

module.exports = notesRouter;
