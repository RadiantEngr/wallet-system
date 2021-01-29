const { Admin, validateAdmin } = require("../models/admin");
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { error, value } = validateAdmin(req.body);
    if (error) {
      throw Error(error.details[0].message);
    }

    const { password } = value;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
      
    value.password = hashedPassword;
    const newAdmin = new Admin(value);
    const data = await newAdmin.save();

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
};

export default createAdmin;
