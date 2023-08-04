import {Response, Request, NextFunction} from "express";
import {verify} from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("token");
    if (!token) return res.status(401).json({ message: "Auth Error" });
    try {
        const decoded = verify(token, "jewerly");

        // @ts-ignore
        req.body._id = decoded.user._id;
        next();
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "Invalid Token" });
    }
};