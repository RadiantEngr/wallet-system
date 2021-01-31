import { Request, Response } from "express";
import { User } from "../models/user";
import { Admin } from "../models/admin";

const fundByAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res
        .status(400)
        .json({ Error: "You are not allowed to perform this operation" });
    }

      const { userEmail, transactionCurrency, amount } = req.body;
      
      if (amount < 0) {
          return res.status(0).json({Error: "Negative amount not allowed"})
      }

      const user = await User.findOne({ email: userEmail });
      const { wallets } = user;
      let targetWallet = wallets.filter((wallet: { currency: string; }) => wallet.currency == transactionCurrency);
      targetWallet = targetWallet[0];

      if (!targetWallet) {
          return res.status(400).json({ Error: "No match currencies in the user wallet" });
      }
      const totalWalletBalance = targetWallet.balance + amount;
      
      await User.findOneAndUpdate(
        { email: userEmail, "wallets.currency": transactionCurrency },
        {
          $set: {
            "wallets.$": [
              {
                currency: transactionCurrency,
                lastTransaction: `FUNDING of ${amount} ${transactionCurrency}`,
                balance: totalWalletBalance,
              },
            ],
            updatedAt: Date.now(),
          },
        }
      );

    return res
      .status(200)
      .json({ Message: "Wallet has been successfull funded" });
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
};

export default fundByAdmin;
