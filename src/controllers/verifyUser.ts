const { User } = require("../models/user");
import { Request, Response } from "express";
import jwt from "jwt-simple";

const verifyUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const { otpProvidedByUser } = req.body;

    if (!otpProvidedByUser) {
      return res.status(400).json({ Error: "OTP is required" });
    }

    const user = await User.findOne({ email });
    const { userName, password, token } = user;

    const secret = `${userName}-${password}`;
    const payload = jwt.decode(token, secret);
    const otpSentToUser = payload.random;

    if (otpSentToUser !== otpProvidedByUser) {
      return res.status(400).json({ Error: "Incorrect details" });
    }

    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          isVerified: true,
        },
      }
    );
    res.status(200).json({ Success: "You are successfully signed up" });
  } catch (err) {
    res.status(401).json({ Error: err.message });
  }
};

export default verifyUser;
