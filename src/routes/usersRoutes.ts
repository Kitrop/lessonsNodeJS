import express, {Request, Response} from "express";
import {CreateUserModule, DeleteAndGetUserModule, GetUsersModule} from "../ts/types";
import {usersRepository} from "../repositories/userRepository";
import {bodyNameRequired, bodyPassRequired, HTTP_STATUSES, idParamRequired, putValidation} from "../utilities";
import {body, param, validationResult} from 'express-validator';

// Создаем маршрутизатор для обработки запросов связанных с пользователями
const userRouter = express.Router();

userRouter
    // Получение пользователей или пользователей по имени
    .get('/', async (req: GetUsersModule<{ name: string }>, res: Response) => {
        const getUsers = await usersRepository.giveUsers(req.query.name);
        if (getUsers.status === HTTP_STATUSES.OK200) {
            res.status(HTTP_STATUSES.OK200).json(getUsers.data);
        } else {
            res.status(getUsers.status).json(getUsers.data);
        }
    })

    // Получение пользователя по айди
    .get('/:id', idParamRequired, async (req: DeleteAndGetUserModule<{ id: string }>, res: Response) => {
        const getUserById = await usersRepository.giveUserById(req.params.id);
        res.status(getUserById.status).json(getUserById.data);
    })

    // Создание нового пользователя
    .post('/', bodyNameRequired, bodyPassRequired, async (req: CreateUserModule<{ name: string; password: string }>, res: Response) => {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const createUser = await usersRepository.createUser(req.body.name, req.body.password);
            res.status(createUser.status).json(createUser.data)
        } else {
            res.status(400).json({errors: result.array()})
        }
    })

    // Удаление пользователя по айди
    .delete('/:id?', idParamRequired, async (req, res) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            // @ts-ignore
            const deleteUser = await usersRepository.deleteUser(req.params.id)
            res.sendStatus(deleteUser.status)
        } else {
            res.status(400).json({errors: result.array()});
        }
    })

    // Обновление пользователя по айди
    .patch('/:id?', idParamRequired, body('name').exists().notEmpty(), body('password').exists().notEmpty(), putValidation, async (req: Request<{ id: string }>, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const updateUser = await usersRepository.updateUser(req.params.id, req.body.name, req.body.password);
            res.status(updateUser.status).json(updateUser.data);
        } else {
            res.status(400).json({errors: result.array()})
        }
    });

export default userRouter