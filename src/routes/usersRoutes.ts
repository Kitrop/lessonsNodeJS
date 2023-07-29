import express, {NextFunction, Request, Response} from "express";
import {CreateUserModule, DeleteAndGetUserModule, GetUsersModule, IGetUsers} from "../ts/types";
import {usersRepository} from "../repositories/userRepository";
import {HTTP_STATUSES} from "../utilities";
import {body, param, query, validationResult} from 'express-validator';

const userRouter = express.Router();
const idParamRequired = param('id').notEmpty().escape()
const bodyNameRequired = body('name').matches(/^[^0-9]+$/, "g").trim().notEmpty()

userRouter
    // Получение пользователей
    .get('/',query('name').isString, (req: GetUsersModule<{ name: string }>, res: Response<IGetUsers[]>) => {
        const getUsers = usersRepository.giveUsers(req.query.name)
        if (getUsers.status === 200) {
            // @ts-ignore
            res.json(getUsers.data)
                .sendStatus(HTTP_STATUSES.OK200)
        }
        else {
            res.sendStatus(getUsers.status)
        }
    })

    // Получение определенного пользователя. :param - параметр
    .get('/:id',(req: DeleteAndGetUserModule<{ id: string }>, res: Response<IGetUsers>) => {
        const getUserById = usersRepository.giveUserById(req.params.id)
        if(getUserById.status === 200) {
            // @ts-ignore
            res.json(getUserById.data)
                .sendStatus(HTTP_STATUSES.OK200)
        }
        else {
            res.sendStatus(getUserById.status)
        }
    })

    // Добавление пользователя
    .post('/', bodyNameRequired,(req: CreateUserModule<{ name: string }>, res: Response) => {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const createUser = usersRepository.createUser(req.body.name)
            res.status(createUser.status).send(createUser.data)
        }
        res.status(400)
            .send({errors: result.array()})
    })

    // Удаление пользователя
    .delete('/:id?', idParamRequired, (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            // @ts-ignore
            const deleteUser = usersRepository.deleteUser(req.params.id)
            res.sendStatus(deleteUser.status)
        }
        res.status(400)
            .send({errors: result.array()})
    })

    // Обновление данных у пользователя
    .put('/:id?', idParamRequired, bodyNameRequired,(req: Request<{ id: string }>, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const updateUser = usersRepository.updateUser(req.params.id, req.body.name)
            res.status(updateUser.status)
                .send(updateUser.data)
        }
        res.status(400)
            .send({errors: result.array()});
    })

export default userRouter