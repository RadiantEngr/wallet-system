import jwt from "jwt-simple";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Admin } from "../models/admin";
import dotenv from "dotenv";
dotenv.config();

const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, passwordEntered } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(400).json({ Error: "Invalid email or password" });
    }

    const { password, _id, accountType } = admin;
    const isPasswordValid = await bcrypt.compare(passwordEntered, password);

    if (!isPasswordValid) {
      return res.status(400).json({ Error: "Invalid email or password" });
    }

    const token = jwt.encode({ _id, accountType }, `${process.env.JWT_SECRET}`);

    return res.status(200).json({ _id, accountType, token });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

export default adminLogin;
