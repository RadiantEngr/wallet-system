import jwt from "jwt-simple";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import dotenv from "dotenv";
dotenv.config();

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, passwordEntered } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ Error: "Invalid email or password" });
        }

        const { password, _id, accountType } = user;
        const isPasswordValid = await bcrypt.compare(passwordEntered, password);

        if (!isPasswordValid) {
            return res.status(400).json({Error: "Invalid email or password"})
        }

        const token = jwt.encode({ _id, accountType }, `${process.env.JWT_SECRET}`);
        
        return res.status(200).json({ _id, accountType, token });     

    } catch (err) {
        return res.status(500).json({ Error: err.message });
    }
}

export default userLogin;