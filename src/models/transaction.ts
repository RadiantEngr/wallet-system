import Joi from "joi";
import mongoose from "mongoose";

const Transaction = mongoose.model(
    "Transaction",
    new mongoose.Schema({
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
    })
);

const validateTransaction = (transaction: any) => {
    const schema = Joi.object({
        transactionType: Joi.string().required(),
        owner: Joi.string(),
        currency: Joi.string().required(),
        amount: Joi.number().required(),
        isApproved: Joi.boolean(),
    });

    return schema.validate(transaction);
};

export { Transaction, validateTransaction };
