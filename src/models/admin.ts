import Joi from "joi";


import mongoose from "mongoose";

const Admin = mongoose.model(
    "Admin",
    new mongoose.Schema({
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
    })
);

const validateAdmin = (admin: any) => {
    const schema = Joi.object({
        accountType: Joi.string().required,
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return schema.validate(admin);
};

export { Admin, validateAdmin };
