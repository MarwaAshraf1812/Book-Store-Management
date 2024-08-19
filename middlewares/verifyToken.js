const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({message: "invalid token"});
        }
    } else {
        res.status(401).json({message: "No Token Provided"});
    }
}

function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({message: "You are not allowed"});
        }
    })
}

function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({message: "You are not allowed, only admin"});
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
}