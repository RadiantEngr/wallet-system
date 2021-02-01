import { Transaction } from "../models/transaction";
import { User } from "../models/user";
import { Request, Response } from "express";

const deleteUser = async (req: Request, res: Response) => {

    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({Error: "The user you are trying to delete does not exist"})
    }

    const data = await User.findByIdAndDelete(id);

    return res.status(400).json(data);
}

const deleteTransaction = async (req: Request, res: Response) => {

    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
        return res.status(404).json({ Error: "The user you are trying to delete does not exist" })
    }

    const data = await Transaction.findByIdAndDelete(id);

    return res.status(400).json(data);
}

export { deleteUser, deleteTransaction };