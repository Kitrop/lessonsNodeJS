import {Request, Response, Router} from "express";
import {body, validationResult} from "express-validator";
import {authRepository} from "../repositories/authRepository";
import {
    authMiddleware,
    getValidationPassword,
    postValidationEmail, postValidationPassword,
    postValidationUsername
} from "./middlewares/authMiddleware";
import {UsersModel} from "../models/UsersModel";

const authRouter = Router()



authRouter
    .post('/login', postValidationEmail, getValidationPassword, async (req: Request, res: Response) => {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const response = await authRepository.loginUser(req.body.email, req.body.password)
            res.json({
                data: response.data,
                token: response.token
            })
                .status(response.status)
        } else {
            res.status(400).json({errors: result.array()})

        }
    })
    // Создание пользователя
    .post('/registration', postValidationUsername, postValidationPassword, postValidationEmail, async (req: Request, res: Response) => {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const response = await authRepository.createUser(req.body.username, req.body.email, req.body.password)
            res.json(response.data)
                .status(response.status)
        } else {
            res.status(400).json({errors: result.array()})
        }
    })

    .get('/me', authMiddleware, async (req: Request, res: Response) => {
        try {
            const _id = req.body._id
            const user = await UsersModel.findOne({_id})
            res.json(user)
        } catch (e) {
            res.send({message: "Error in Fetching user"});
        }
    })
export default authRouter