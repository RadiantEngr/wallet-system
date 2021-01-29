"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdmin = exports.Admin = void 0;
var joi_1 = __importDefault(require("joi"));
var mongoose_1 = __importDefault(require("mongoose"));
var Admin = mongoose_1.default.model("Admin", new mongoose_1.default.Schema({
    accountType: {
        type: String,
        required: true,
        default: "ADMIN"
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}));
exports.Admin = Admin;
var validateAdmin = function (admin) {
    var schema = joi_1.default.object({
        accountType: joi_1.default.string().required,
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    });
    return schema.validate(admin);
};
exports.validateAdmin = validateAdmin;
