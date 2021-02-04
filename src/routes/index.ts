import express from "express";
import signUp from "../controllers/userSignup";
import verifyUser from "../controllers/verifyUser";
import createAdmin from "../controllers/createAdmin";
import userLogin from "../controllers/userLogin";
import adminLogin from "../controllers/adminLogin";
import makeTransaction from "../controllers/makeTransaction"
import auth from "../middleware/auth";
import changeAccountType from "../controllers/changeAccountType";
import changeMainCurrency from "../controllers/changeMainCurrency";
import approveFunding from "../controllers/approveFunding";
import fundByAdmin from "../controllers/adminFundingWallet";
import { findUsers, findUser, findTransactions, findTransaction } from "../controllers/findData";
import { deleteUser, deleteTransaction } from "../controllers/deleteItem";
import { findUsersByCategory, findTransactionsByCategory } from "../controllers/findByCategory";
import { requestPasswordReset, changePassword } from "../controllers/passwordReset";

const router = express.Router();

router.post("/signup", signUp);

router.put("/verifyuser/:email", verifyUser);

router.post("/admin", createAdmin);

router.post("/userlogin", userLogin);

router.post("/adminlogin", adminLogin);

router.post("/transaction/:id", auth, makeTransaction);

router.put("/changeaccount/:id", auth, changeAccountType);

router.put("/changemain/:id", auth, changeMainCurrency);

router.put("/approvefund/:id", auth, approveFunding);

router.put("/fundbyadmin/:id", auth, fundByAdmin);

router.get("/findusers", findUsers);

router.get("/finduser/:id", findUser);

router.get("/findtransactions", findTransactions);

router.get("/findtransaction/:id", findTransaction);

router.delete("/deleteuser/:id", deleteUser);

router.delete("/deletetransaction/:id", deleteTransaction);

router.get("/usersbycategory/:accountType", findUsersByCategory);

router.get("/transactionsbycategory/:transactionType", findTransactionsByCategory);

router.post("/passwordreset", requestPasswordReset);

router.put("/passwordreset/:token", changePassword);


export default router;