import express from "express";
import signUp from "../controllers/userSignup";
import verifyUser from "../controllers/verifyUser";
import createAdmin from "../controllers/createAdmin";

const router = express.Router();

router.post("/signup", signUp);

router.put("/verifyuser/:email", verifyUser);

router.post("/admin", createAdmin);

export default router;