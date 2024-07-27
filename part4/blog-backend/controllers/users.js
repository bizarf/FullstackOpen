const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
    const users = await User.find({}).populate("blogs", {
        url: 1,
        title: 1,
        author: 1,
        id: 1,
    });
    res.json(users);
});

usersRouter.post("/", async (req, res) => {
    const { username, name, password } = req.body;

    // check the password length here as the hashed password will always have a different length
    if (password.length < 3) {
        res.status(400).json({
            error: "expected `password` to be at least 3 characters",
        });
    } else {
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            name,
            passwordHash,
        });

        const savedUser = await user.save();

        res.status(201).json(savedUser);
    }
});

module.exports = usersRouter;
