"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwt_simple_1 = __importDefault(require("jwt-simple"));
var auth = function (req, res, next) {
    try {
        var token = req.headers.token;
        var id = req.params.id;
        if (!token)
            return res.status(401).json({ Error: "Access denied. No token provised." });
        var decodedToken = jwt_simple_1.default.decode("" + token, "" + process.env.JWT_SECRET);
        var _id = decodedToken._id;
        if (id !== _id) {
            return res.status(400).json({ Error: "Invalid user identity" });
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ Error: "Invalid request" });
    }
};
exports.default = auth;
