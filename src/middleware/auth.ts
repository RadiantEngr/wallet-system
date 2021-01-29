import jwt from "jwt-simple";
import { Request, Response, NextFunction } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.headers;
        const { id } = req.params;

        if (!token)
            return res.status(401).json({ Error: "Access denied. No token provised." });
        
        const decodedToken = jwt.decode(`${token}`, `${process.env.JWT_SECRET}`);
        const { _id } = decodedToken;

        if (id !== _id) {
            return res.status(400).json({Error: "Invalid user identity"})
        }
        
        next();

    } catch (err) {
        return res.status(401).json({ Error: "Invalid request" });
    }
}

export default auth;