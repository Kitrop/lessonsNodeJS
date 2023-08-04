import {Response, Request, NextFunction} from "express";
import {verify} from "jsonwebtoken";
import {body} from "express-validator";

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


// Middlewares для валидации данных
export const postValidationUsername = body('username').trim().notEmpty().escape()
export const postValidationPassword = body('password').isStrongPassword().notEmpty().escape()
export const postValidationEmail = body('email').isEmail().notEmpty()
export const getValidationPassword = body('password').trim().notEmpty()
export const getId = body('_id').trim().notEmpty().escape()