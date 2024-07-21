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
    }

    next(err);
};

module.exports = {
    unknownEndpoint,
    errorHandler,
    requestLogger,
};
