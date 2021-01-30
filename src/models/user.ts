import Joi from "joi";
import mongoose from "mongoose";

const User = mongoose.model(
    "User",
    new mongoose.Schema({
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
    })
);

const validateUser = (user: any) => {
    const schema = Joi.object({
        accountType: Joi.string().required(),
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        wallets: Joi.array().items(
            Joi.object().keys({
                currency: Joi.string(),
                lastTransaction: Joi.string(),
                balance: Joi.number(),
            })
        ),
        isVerified: Joi.boolean(),
        token: Joi.string(),
    });

    return schema.validate(user);
};

export { User, validateUser };
