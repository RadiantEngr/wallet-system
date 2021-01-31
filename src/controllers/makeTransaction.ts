const { Transaction, validateTransaction } = require("../models/transaction");
import { Request, Response } from "express";
import { convert, fixerCurrencies } from "./currencyMethods";
const { User } = require("../models/user");

const makeTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ Error: "You are not allowed to perform this operation" });
    }

    const { error, value } = validateTransaction(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }

    let { transactionType, transactionCurrency, amount } = value;
    transactionType = transactionType.toUpperCase();
    value.owner = id;

    const supportedCurrencies: any = await fixerCurrencies();

    if (amount < 0) {
      return res.status(400).json({ Error: "Negative amounts not allowed" });
    }

    if (!supportedCurrencies.includes(transactionCurrency)) {
      return res
        .status(400)
        .json({ Error: "Transaction currency is not supported" });
    }

    const { accountType, wallets, email } = user;

    if (transactionType == "WITHDRAWAL") {
      amount *= -1;
    } else if (transactionType == "FUNDING") {
      amount = amount;
    } else {
      return res.status(400).json({ Error: "Invalid transaction type" });
    }

    //CASES WHEN THE USER IS A NOOB
    if (accountType == "NOOB") {
      const walletCurrency = wallets[0].currency;
      let walletBalance = wallets[0].balance;

      const convertedAmount = await convert(
        transactionCurrency,
        walletCurrency,
        amount
      );

      walletBalance += convertedAmount;

      value.convertedTo = walletCurrency;
      value.conversionAmount = convertedAmount.toFixed(2);

      //Noob withdrawal
      if (transactionType == "WITHDRAWAL") {
        if (walletBalance < 0) {
          return res.status(400).json({ Error: "Insufficient balance" });
        }
        value.isApproved = true;
        amount *= -1;
        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              wallets: [
                {
                  currency: walletCurrency,
                  lastTransaction: `${transactionType} of ${amount} ${transactionCurrency}`,
                  balance: walletBalance.toFixed(2),
                },
              ],
              updatedAt: Date.now(),
            },
          }
        );
      }

      //Noob funding
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            wallets: [
              {
                currency: walletCurrency,
                lastTransaction: `${transactionType} of ${amount} ${transactionCurrency}`,
                balance: walletBalance.toFixed(2),
              },
            ],
            updatedAt: Date.now(),
          },
        }
      );
    }

    // //CASES WHEN THE USER IS AN ELITE
    const mainCurrency = wallets[0].currency;
    const mainBalance = wallets[0].balance;

    const convertToMain = await convert(
      transactionCurrency,
      mainCurrency,
      amount
    );

    const mainBalanceAfterTransaction = mainBalance + convertToMain;

    let matchObj = wallets.filter(
      (wallet: { currency: string }) => wallet.currency == transactionCurrency
    );

    matchObj = matchObj[0];
    const objIndex = wallets.indexOf(matchObj);
    
    // //When the transaction currency already exists
    if (matchObj) {
      const walletCurrency = matchObj.currency;
      let walletBalance = matchObj.balance;

      const convertedAmount = await convert(
        transactionCurrency,
        walletCurrency,
        amount
      );

      walletBalance += convertedAmount;

      value.convertedTo = walletCurrency;
      value.conversionAmount = convertedAmount.toFixed(2);

      if (transactionType == "WITHDRAWAL") {
        amount *= -1;
        value.isApproved = true;

        if (walletBalance < 0 && mainBalanceAfterTransaction < 0) {
          return res.status(400).json({ Error: "Insufficient balance" });
        }

        // Deduct money from main wallet if there is no sufficient fund in the currency of transaction
        if (walletBalance < 0 && mainBalanceAfterTransaction > 0) {
          value.convertedTo = mainCurrency;
          value.conversionAmount = convertToMain.toFixed(2);

          value.isApproved = true;

          await User.findOneAndUpdate(
            { email, "wallets.currency": mainCurrency },
            {
              $set: {
                "wallets.$": [
                  {
                    currency: mainCurrency,
                    lastTransaction: `${transactionType} of ${amount} ${transactionCurrency}`,
                    balance: mainBalanceAfterTransaction.toFixed(2),
                  },
                ],
                updatedAt: Date.now(),
              },
            }
          );
        }

        //When there is sufficient funds in the currency of transaction, withdraw directly from the wallet
        if (walletBalance > 0) {
          await User.findOneAndUpdate(
            { email, "wallets.currency": walletCurrency },
            {
              $set: {
                "wallets.$": [
                  {
                    currency: walletCurrency,
                    lastTransaction: `${transactionType} of ${amount} ${transactionCurrency}`,
                    balance: walletBalance.toFixed(2),
                  },
                ],
                updatedAt: Date.now(),
              },
            }
          );
        }
      }

      //Fund an existing wallet of same currency as transaction currency (BUG IS HERE)
        if (transactionType == "FUNDING") {
          await User.findOneAndUpdate(
            { email, "wallets.currency": walletCurrency },
            {
              $set: {
                "wallets.$": [
                  {
                    currency: walletCurrency,
                    lastTransaction: `${transactionType} of ${amount} ${transactionCurrency}`,
                    balance: walletBalance.toFixed(2),
                  },
                ],
                updatedAt: Date.now(),
              },
            }
          );
      }
      
    }
      
    //Deduct money from main wallet if the currency of transaction does not exist, and there is sufficiend funds in the main currency
    if (transactionType == "WITHDRAWAL" && !matchObj) {
      amount *= -1;
      value.isApproved = true;

      if (mainBalanceAfterTransaction < 0) {
        return res.status(400).json({ Error: "Insufficient balance" });
      }
      value.convertedTo = mainCurrency;
      value.conversionAmount = convertToMain.toFixed(2);
      value.isApproved = true;

      await User.findOneAndUpdate(
        { email, "wallets.currency": mainCurrency },
        {
          $set: {
            "wallets.$": [
              {
                currency: mainCurrency,
                lastTransaction: `${transactionType} of ${amount} ${transactionCurrency}`,
                balance: mainBalanceAfterTransaction.toFixed(2),
              },
            ],
            updatedAt: Date.now(),
          },
        }
      );
    }

    //Create a new wallet if funding is done (by an Elite) with a currency that does not exist
    if (transactionType == "FUNDING" && !matchObj) {
      await User.findOneAndUpdate(
        { email },
        {
          $addToSet: {
            wallets: {
              currency: transactionCurrency,
              lastTransaction: `${transactionType} of ${amount} ${transactionCurrency}`,
              balance: amount.toFixed(2),
            },
          },
        }
      );

      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            updatedAt: Date.now(),
          },
        }
      );
    }
    const newTransaction = new Transaction(value);
    const data = await newTransaction.save();

    return res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

export default makeTransaction;
