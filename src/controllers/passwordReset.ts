import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jwt-simple";
import bcrypt from "bcrypt";
import sendMail from "../mailer";

const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "You are not a registered user" });
    }

    const { _id } = user;
    const token = jwt.encode({ _id }, `${process.env.JWT_SECRET}`);

    const subject = "PASSWORD RESET";
    const content = `Click the following link to reset your password:\nhttp://localhost:3000/apiv1/${token}`;
    sendMail(subject, content, email);

    res.status(200).json({ message: "Email notification sent", token });
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};


const changePassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { email, newPassword, confirmNewPassword } = req.body;
        if (newPassword.length < 4 || newPassword !== confirmNewPassword) {
          res.status(400).send("Make sure passwords match and has at least 4 characters");
        }

        const user = await User.findOne({ email });
        const payload = jwt.decode(token, `${process.env.JWT_SECRET}`);

        if (payload._id == user._id) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            await User.findOneAndUpdate({ email }, {
                $set: {
                    password: hashedPassword
                }
            })

            res.status(200).json({ message: "Password has been reset successfully" });
        } else {
            res.status(401).json({ message: "You are not allowed to perform this activity" });
        }
    } catch (err) {
        res.status(401).json({ Error: err.message });
    }
}

export { requestPasswordReset, changePassword };
