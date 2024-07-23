const notesRouter = require("express").Router();
const Note = require("../models/note");

// fetch all notes
notesRouter.get("/", async (req, res) => {
    const notes = await Note.find({});
    res.json(notes);
});

// fetch a single note
notesRouter.get("/:id", async (req, res, next) => {
    const note = await Note.findById(req.params.id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

// delete a note
notesRouter.delete("/:id", async (req, res, next) => {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

// add a note
notesRouter.post("/", async (req, res, next) => {
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

    const savedNote = await note.save();
    res.status(201).json(savedNote);
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
