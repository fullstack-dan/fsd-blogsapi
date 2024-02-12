const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("Authentication invalid");
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, name: payload.name,
            isAdmin: payload.isAdmin, role: payload.role };
        next();
    } catch (error) {
        throw new UnauthenticatedError("Authentication invalid");
    }
};

module.exports = authenticationMiddleware;
