const logger = require("./logger");

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};

// 404 message for when a user tries to go to a route that doesn't exist
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    } else if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
    } else if (
        err.name === "MongoServerError" &&
        err.message.includes("E11000 duplicate key error")
    ) {
        return res
            .status(400)
            .json({ error: "expected `username` to be unique" });
    } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "token invalid" });
    } else if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            error: "token expired",
        });
    }

    next(err);
};

module.exports = {
    unknownEndpoint,
    errorHandler,
    requestLogger,
};
