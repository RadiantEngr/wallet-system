"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = exports.Transaction = void 0;
var joi_1 = __importDefault(require("joi"));
var mongoose_1 = __importDefault(require("mongoose"));
var Transaction = mongoose_1.default.model("Transaction", new mongoose_1.default.Schema({
    transactionType: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
    },
    currency: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
}));
exports.Transaction = Transaction;
var validateTransaction = function (transaction) {
    var schema = joi_1.default.object({
        transactionType: joi_1.default.string().required(),
        owner: joi_1.default.string(),
        currency: joi_1.default.string().required(),
        amount: joi_1.default.number().required(),
        isApproved: joi_1.default.boolean(),
    });
    return schema.validate(transaction);
};
exports.validateTransaction = validateTransaction;
