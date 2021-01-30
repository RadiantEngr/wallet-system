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
    transactionCurrency: {
      type: String,
      required: true,
    },
    convertedTo: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    conversionAmount: {
      type: Number,
      default: 0,
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
      transactionCurrency: Joi.string().required(),
      convertedTo: Joi.string(),
      amount: Joi.number().required(),
      conversionAmount: Joi.number(),
      isApproved: Joi.boolean(),
    });

    return schema.validate(transaction);
};

export { Transaction, validateTransaction };
