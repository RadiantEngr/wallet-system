import express from "express";
import signUp from "../controllers/userSignup";
import verifyUser from "../controllers/verifyUser";

const router = express.Router();

router.post("/signup", signUp);

router.put("/verifyuser/:email", verifyUser);

export default router;