import express from "express";
import signUp from "../controllers/userSignup";
import verifyUser from "../controllers/verifyUser";
import createAdmin from "../controllers/createAdmin";
import userLogin from "../controllers/userLogin";
import adminLogin from "../controllers/adminLogin";
import makeTransaction from "../controllers/makeTransaction"
import auth from "../middleware/auth";


const router = express.Router();

router.post("/signup", signUp);

router.put("/verifyuser/:email", verifyUser);

router.post("/admin", createAdmin);

router.post("/userlogin", userLogin);

router.post("/adminlogin", adminLogin);

router.post("/transaction/:id", auth, makeTransaction);


export default router;