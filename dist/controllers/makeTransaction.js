"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require("../models/transaction"), Transaction = _a.Transaction, validateTransaction = _a.validateTransaction;
var currencyMethods_1 = require("./currencyMethods");
var User = require("../models/user").User;
var makeTransaction = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, _a, error, value, transactionType, transactionCurrency_1, amount, supportedCurrencies, accountType, wallets, email, walletCurrency, walletBalance, convertedAmount, mainCurrency, mainBalance, convertToMain, mainBalanceAfterTransaction, matchObj, objIndex, walletCurrency, walletBalance, convertedAmount, newTransaction, data, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 22, , 23]);
                id = req.params.id;
                return [4 /*yield*/, User.findById(id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ Error: "You are not allowed to perform this operation" })];
                }
                _a = validateTransaction(req.body), error = _a.error, value = _a.value;
                if (error) {
                    throw Error(error.details[0].message);
                }
                transactionType = value.transactionType, transactionCurrency_1 = value.transactionCurrency, amount = value.amount;
                transactionType = transactionType.toUpperCase();
                value.owner = id;
                return [4 /*yield*/, currencyMethods_1.fixerCurrencies()];
            case 2:
                supportedCurrencies = _b.sent();
                if (amount < 0) {
                    return [2 /*return*/, res.status(400).json({ Error: "Negative amounts not allowed" })];
                }
                if (!supportedCurrencies.includes(transactionCurrency_1)) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ Error: "Transaction currency is not supported" })];
                }
                accountType = user.accountType, wallets = user.wallets, email = user.email;
                if (transactionType == "WITHDRAWAL") {
                    amount *= -1;
                }
                else if (transactionType == "FUNDING") {
                    amount = amount;
                }
                else {
                    return [2 /*return*/, res.status(400).json({ Error: "Invalid transaction type" })];
                }
                if (!(accountType == "NOOB")) return [3 /*break*/, 7];
                walletCurrency = wallets[0].currency;
                walletBalance = wallets[0].balance;
                return [4 /*yield*/, currencyMethods_1.convert(transactionCurrency_1, walletCurrency, amount)];
            case 3:
                convertedAmount = _b.sent();
                walletBalance += convertedAmount;
                value.convertedTo = walletCurrency;
                value.conversionAmount = convertedAmount.toFixed(2);
                if (!(transactionType == "WITHDRAWAL")) return [3 /*break*/, 5];
                if (walletBalance < 0) {
                    return [2 /*return*/, res.status(400).json({ Error: "Insufficient balance" })];
                }
                value.isApproved = true;
                amount *= -1;
                return [4 /*yield*/, User.findOneAndUpdate({ email: email }, {
                        $set: {
                            wallets: [
                                {
                                    currency: walletCurrency,
                                    lastTransaction: transactionType + " of " + amount + " " + transactionCurrency_1,
                                    balance: walletBalance.toFixed(2),
                                },
                            ],
                            updatedAt: Date.now(),
                        },
                    })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: 
            //Noob funding
            return [4 /*yield*/, User.findOneAndUpdate({ email: email }, {
                    $set: {
                        wallets: [
                            {
                                currency: walletCurrency,
                                lastTransaction: transactionType + " of " + amount + " " + transactionCurrency_1,
                                balance: walletBalance.toFixed(2),
                            },
                        ],
                        updatedAt: Date.now(),
                    },
                })];
            case 6:
                //Noob funding
                _b.sent();
                _b.label = 7;
            case 7:
                mainCurrency = wallets[0].currency;
                mainBalance = wallets[0].balance;
                return [4 /*yield*/, currencyMethods_1.convert(transactionCurrency_1, mainCurrency, amount)];
            case 8:
                convertToMain = _b.sent();
                mainBalanceAfterTransaction = mainBalance + convertToMain;
                matchObj = wallets.filter(function (wallet) { return wallet.currency == transactionCurrency_1; });
                matchObj = matchObj[0];
                objIndex = wallets.indexOf(matchObj);
                if (!matchObj) return [3 /*break*/, 15];
                walletCurrency = matchObj.currency;
                walletBalance = matchObj.balance;
                return [4 /*yield*/, currencyMethods_1.convert(transactionCurrency_1, walletCurrency, amount)];
            case 9:
                convertedAmount = _b.sent();
                walletBalance += convertedAmount;
                value.convertedTo = walletCurrency;
                value.conversionAmount = convertedAmount.toFixed(2);
                if (!(transactionType == "WITHDRAWAL")) return [3 /*break*/, 13];
                amount *= -1;
                value.isApproved = true;
                if (walletBalance < 0 && mainBalanceAfterTransaction < 0) {
                    return [2 /*return*/, res.status(400).json({ Error: "Insufficient balance" })];
                }
                if (!(walletBalance < 0 && mainBalanceAfterTransaction > 0)) return [3 /*break*/, 11];
                value.convertedTo = mainCurrency;
                value.conversionAmount = convertToMain.toFixed(2);
                value.isApproved = true;
                return [4 /*yield*/, User.findOneAndUpdate({ email: email, "wallets.currency": mainCurrency }, {
                        $set: {
                            "wallets.$": [
                                {
                                    currency: mainCurrency,
                                    lastTransaction: transactionType + " of " + amount + " " + transactionCurrency_1,
                                    balance: mainBalanceAfterTransaction.toFixed(2),
                                },
                            ],
                            updatedAt: Date.now(),
                        },
                    })];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11:
                if (!(walletBalance > 0)) return [3 /*break*/, 13];
                return [4 /*yield*/, User.findOneAndUpdate({ email: email, "wallets.currency": walletCurrency }, {
                        $set: {
                            "wallets.$": [
                                {
                                    currency: walletCurrency,
                                    lastTransaction: transactionType + " of " + amount + " " + transactionCurrency_1,
                                    balance: walletBalance.toFixed(2),
                                },
                            ],
                            updatedAt: Date.now(),
                        },
                    })];
            case 12:
                _b.sent();
                _b.label = 13;
            case 13:
                if (!(transactionType == "FUNDING")) return [3 /*break*/, 15];
                return [4 /*yield*/, User.findOneAndUpdate({ email: email, "wallets.currency": walletCurrency }, {
                        $set: {
                            "wallets.$": [
                                {
                                    currency: walletCurrency,
                                    lastTransaction: transactionType + " of " + amount + " " + transactionCurrency_1,
                                    balance: walletBalance.toFixed(2),
                                },
                            ],
                            updatedAt: Date.now(),
                        },
                    })];
            case 14:
                _b.sent();
                _b.label = 15;
            case 15:
                if (!(transactionType == "WITHDRAWAL" && !matchObj)) return [3 /*break*/, 17];
                amount *= -1;
                value.isApproved = true;
                if (mainBalanceAfterTransaction < 0) {
                    return [2 /*return*/, res.status(400).json({ Error: "Insufficient balance" })];
                }
                value.convertedTo = mainCurrency;
                value.conversionAmount = convertToMain.toFixed(2);
                value.isApproved = true;
                return [4 /*yield*/, User.findOneAndUpdate({ email: email, "wallets.currency": mainCurrency }, {
                        $set: {
                            "wallets.$": [
                                {
                                    currency: mainCurrency,
                                    lastTransaction: transactionType + " of " + amount + " " + transactionCurrency_1,
                                    balance: mainBalanceAfterTransaction.toFixed(2),
                                },
                            ],
                            updatedAt: Date.now(),
                        },
                    })];
            case 16:
                _b.sent();
                _b.label = 17;
            case 17:
                if (!(transactionType == "FUNDING" && !matchObj)) return [3 /*break*/, 20];
                return [4 /*yield*/, User.findOneAndUpdate({ email: email }, {
                        $addToSet: {
                            wallets: {
                                currency: transactionCurrency_1,
                                lastTransaction: transactionType + " of " + amount + " " + transactionCurrency_1,
                                balance: amount.toFixed(2),
                            },
                        },
                    })];
            case 18:
                _b.sent();
                return [4 /*yield*/, User.findOneAndUpdate({ email: email }, {
                        $set: {
                            updatedAt: Date.now(),
                        },
                    })];
            case 19:
                _b.sent();
                _b.label = 20;
            case 20:
                newTransaction = new Transaction(value);
                return [4 /*yield*/, newTransaction.save()];
            case 21:
                data = _b.sent();
                return [2 /*return*/, res.status(200).json({ data: data })];
            case 22:
                err_1 = _b.sent();
                res.status(400).json({ Error: err_1.message });
                return [3 /*break*/, 23];
            case 23: return [2 /*return*/];
        }
    });
}); };
exports.default = makeTransaction;
