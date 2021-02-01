import { Transaction } from "../models/transaction";
import { User } from "../models/user";
import { Request, Response } from "express";

const findUsers = async (req: Request, res: Response) => {

    const users = await User.find();

    if (!users) {
        return res.status(404).json({ Message: "No data found" });
    }

    res.status(200).json(users);
}

const findUser = async (req: Request, res: Response) => {

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ Message: "No data found" });
    }

    res.status(200).json(user);
}

const findTransactions = async (req: Request, res: Response) => {

    const transactions = await Transaction.find();

    if (!transactions) {
        return res.status(404).json({ Message: "No data found" });
    }

    res.status(200).json(transactions);
}

const findTransaction = async (req: Request, res: Response) => {

    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
        return res.status(404).json({ Message: "No data found" });
    }

    res.status(200).json(transaction);
}

export { findUsers, findUser, findTransactions, findTransaction };