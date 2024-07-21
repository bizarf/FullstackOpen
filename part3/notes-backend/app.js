const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const notesRouter = require("./controller/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.info("error connecting to MongoDB:", error.message);
    });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(morgan("tiny"));
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(middleware.errorHandler);

module.exports = app;
