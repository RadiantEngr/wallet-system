"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.User = void 0;
var joi_1 = __importDefault(require("joi"));
var mongoose_1 = __importDefault(require("mongoose"));
var User = mongoose_1.default.model("User", new mongoose_1.default.Schema({
    accountType: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    wallets: [
        {
            currency: {
                type: String,
                required: true,
            },
            lastTransaction: {
                type: String,
                default: "No transactions yet",
            },
            balance: {
                type: Number,
                default: 0,
            },
        },
    ],
    isVerified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: null,
    },
}));
exports.User = User;
var validateUser = function (user) {
    var schema = joi_1.default.object({
        accountType: joi_1.default.string().required(),
        userName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(8).required(),
        wallets: joi_1.default.array().items(joi_1.default.object().keys({
            currency: joi_1.default.string(),
            lastTransaction: joi_1.default.string(),
            balance: joi_1.default.number(),
        })),
        isVerified: joi_1.default.boolean(),
        token: joi_1.default.string(),
    });
    return schema.validate(user);
};
exports.validateUser = validateUser;
