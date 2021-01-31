import { Request, Response} from "express";
import { User } from  "../models/user";
import { Admin } from "../models/admin";

const changeAccountType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id);
        if (!admin) {
          return res
            .status(400)
            .json({ Error: "You are not allowed to perform this operation" });
        }

        let { userEmail, newPosition } = req.body;
        newPosition = newPosition.toUpperCase();

        if ((newPosition !== "NOOB") && (newPosition !== "ELITE")) {
            return res.status(400).json({Error: "Invalid user type"})
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(400).json({ Error: "The user with given email was not found" });
        }

        const { accountType, email } = user;
        if (accountType == newPosition) {
            return res.status(400).json({Error: "The user alredy occupies this position. Do you mean to type a different position?"})
        }

        await User.findOneAndUpdate({ email }, {
            $set: {
                accountType: newPosition
            }
        })

        return res.status(200).json({Message: `Account type has been successfully changed to ${newPosition}`});
        
    } catch (err) {
        return res.status(400).json({ Error: err.message });
    }
    
}

export default changeAccountType;