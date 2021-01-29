import Axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const convert = async (from: string, to: string, amount: number) => {
  const fixer = await Axios.get(`${process.env.FIXER_SERVICE}`);

  const allRates = fixer.data.rates;

  return (allRates[to] / allRates[from]) * amount;

  console.log(allRates);
};

const fixerCurrencies = async () => {
  const fixer = await Axios.get(`${process.env.FIXER_SERVICE}`);

  const allRates = fixer.data.rates;

  return Object.keys(allRates);
};

export { convert, fixerCurrencies };
