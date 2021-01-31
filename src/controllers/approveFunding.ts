import { Request, Response } from "express";
import { User } from "../models/user";
import { Admin } from "../models/admin";
import { Transaction } from "../models/transaction";

const approveFunding = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res
        .status(400)
        .json({ Error: "You are not allowed to perform this operation" });
    }

      const { transactionID } = req.body;

      const transaction = await Transaction.findById(transactionID);

      const { owner, convertedTo, conversionAmount, isApproved } = transaction;

      if (isApproved) {
          return res.status(400).json({Error: "This transaction has been previously approved and account has been updated"})
      }
      const user = await User.findOneAndUpdate({ _id: owner });
      const { accountType, wallets } = user;

      if (accountType == "ELITE") {
          return res.status(400).json({ Error: "Approval is required for NOOB users only" });
      }

      const totalBalance = wallets[0].balance + conversionAmount;
            
      await User.findOneAndUpdate(
        { _id: owner },
        {
          $set: {
            wallets: [
              {
                currency: convertedTo,
                lastTransaction: `FUNDING of ${conversionAmount} ${convertedTo}`,
                balance: totalBalance,
              },
            ],
            updatedAt: Date.now(),
          },
        }
      );

      await Transaction.findOneAndUpdate({ _id: transactionID }, {
          $set: {
              isApproved: true,
              updatedAt: Date.now()
          }
      })

      return res.status(200).json({Message: "Transaction successfully approved"})
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
};

export default approveFunding;
