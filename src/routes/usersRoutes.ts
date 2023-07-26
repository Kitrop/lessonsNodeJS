import express, {NextFunction, Request, Response} from "express";
import {CreateUserModule, DeleteAndGetUserModule, GetUsersModule, IGetUsers} from "../ts/types";
import {usersRepository} from "../userRepository";
import {HTTP_STATUSES} from "../utilities";

const userRouter = express.Router();


userRouter
    // Получение пользователей
    .get('/', (req: GetUsersModule<{ name: string }>, res: Response<IGetUsers[]>) => {
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
    .get('/:id', (req: DeleteAndGetUserModule<{ id: string }>, res: Response<IGetUsers>) => {
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
    .post('/', (req: CreateUserModule<{ name: string }>, res: Response) => {
        const createUser = usersRepository.createUser(req.body.name)
        res.status(createUser.status).send(createUser.data)
    })

    // Удаление пользователя
    .delete('/:id', (req: Request<{ id: string }>, res: Response) => {
        if (!req.params.id || +req.params.id < 0) {
            res.sendStatus(HTTP_STATUSES.BadRequest400)
        }
        const deleteUser = usersRepository.deleteUser(req.params.id)
        res.sendStatus(deleteUser.status)
    })

    // Обновление данных у пользователя
    .put('/:id', express.json(), (req: Request<{ id: string }>, res: Response) => {
        const updateUser = usersRepository.updateUser(req.params.id, req.body.name)
        res.status(updateUser.status)
            .send(updateUser.data)
    })

export default userRouter