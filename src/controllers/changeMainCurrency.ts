import { Request, Response } from "express";
import { User } from "../models/user";
import { Admin } from "../models/admin";
import { convert, fixerCurrencies } from "./currencyMethods";

const changeMainCurrency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res
        .status(400)
        .json({ Error: "You are not allowed to perform this operation" });
    }

    let { userEmail, newMainCurrency } = req.body;
    newMainCurrency = newMainCurrency.toUpperCase();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res
        .status(400)
        .json({ Error: "The user with the given email was not found" });
    }

    const supportedCurrencies = await fixerCurrencies();

    if (!supportedCurrencies.includes(newMainCurrency)) {
      return res.status(400).json({ Error: "This currency is not supported" });
    }

    const { accountType, email, wallets } = user;
    const oldMainCurrency = wallets[0].currency;
    const oldMainBalance = wallets[0].balance;

    if (oldMainCurrency == newMainCurrency) {
      return res.status(400).json({
        Error:
          "Your currency you entered is the same as the existing main currency",
      });
    }

    if (accountType == "NOOB") {
      const convertedFormerMainBalance = await convert(
        oldMainCurrency,
        newMainCurrency,
        oldMainBalance
      );

      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            wallets: {
              lastTransaction: `Main currency changed from ${oldMainCurrency} to ${newMainCurrency}`,
              balance: convertedFormerMainBalance.toFixed(2),
              currency: newMainCurrency,
            },
          },
        }
      );
    }

    let similarWallet = wallets.filter(
      (wallet: { currency: string }) => wallet.currency == newMainCurrency
    );
    similarWallet = similarWallet[0];

    if (!similarWallet) {
      await User.findOneAndUpdate(
        { email },
        {
          $push: {
            wallets: {
              $each: [
                {
                  currency: newMainCurrency,
                  lastTransaction: `No transactions yet`,
                  balance: 0,
                },
              ],
              $position: 0,
            },
          },
        }
      );
    } else {
      await User.findOneAndUpdate(
        { email, wallets: similarWallet },
        {
          $pull: {
            wallets: similarWallet,
          },
        }
      );

      await User.findOneAndUpdate(
        { email },
        {
          $push: {
            wallets: {
              $each: [similarWallet],
              $position: 0,
            },
          },
        }
      );
    }

    return res
      .status(200)
      .json({
        Message: `Main currency successfully changed to ${newMainCurrency}`,
      });
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
};

export default changeMainCurrency;
