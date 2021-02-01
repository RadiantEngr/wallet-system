import { Transaction } from "../models/transaction";
import { User } from "../models/user";
import { Request, Response } from "express";

const findUsersByCategory = async (req: Request, res: Response) => {

    let { accountType } = req.params;
    accountType = accountType.toUpperCase();
    const users = await User.find({accountType});

    if (!users) {
        return res.status(404).json({ Message: "No data found" });
    }

    res.status(200).json(users);
}

const findTransactionsByCategory = async (req: Request, res: Response) => {

    let { transactionType } = req.params;
    transactionType = transactionType.toUpperCase();
    const transactions = await Transaction.find({transactionType});

    if (!transactions) {
        return res.status(404).json({ Message: "No data found" });
    }

    res.status(200).json(transactions);
}

export { findUsersByCategory, findTransactionsByCategory };