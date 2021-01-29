const { Transaction, validateTransaction } = require("../models/transaction");
import { Request, Response } from "express";
import { convert, fixerCurrencies } from "./currencyConverter";
const { User } = require("../models/user");

const makeTransaction = async (req: Request, res: Response) => {
    try {
          const supportedCurrencies: any = await fixerCurrencies();
console.log(supportedCurrencies);

    const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
          return res.status(400).json({Error: "You are not allowed to perform this operation"})
      }
      
    const { error, value } = validateTransaction(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }
      
        let { transactionType, transactionCurrency, amount } = value;

        if (!supportedCurrencies.includes(transactionCurrency)) {
            return res.status(400).json({Error: "Transaction currency is not supported"})
        }

      const { accountType, wallets } = user;
      console.log(wallets);
      


      if (transactionType == "WITHDRAWAL") {
          amount *= -1;

      } else if (transactionType == "FUNDING") {
          amount = amount
      } else {
          return res.status(400).json({ Error: "Invalid transaction type" });
      }
      
      console.log(amount);
      
      if (accountType == "NOOB") {
          const walletCurrency = wallets[0].currency;
          let walletBalance = wallets[0].balance;

          const convertedAmount = await convert(transactionCurrency, walletCurrency, amount)
          walletBalance += convertedAmount;

          if (walletBalance < 0) {
              return res.status(400).json({ Error: "Insufficient balance" });
          }
         
          value.owner = id;
          value.convertedTo = walletCurrency;
          value.conversionAmountsxxds = convertedAmount;

          const newTransaction = new Transaction(value);
          const data = await newTransaction.save();

          return res.status(200).json({ data });
      }        
      
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

export default makeTransaction;
