import express, { Request, Response } from "express";
import { CreateUserModule, DeleteAndGetUserModule, GetUsersModule, IGetUsers } from "./ts/types";
import { urlencodedParser } from "./app";
import { deleteUser, HTTP_STATUSES, users } from "./utilities";

const userRouter = express.Router();

// Получение пользователей
userRouter
    .get('/', (req: GetUsersModule<{ name: string }>, res: Response<IGetUsers[]>) => {
        let findUsersQuery = users
        // если пришел query parameter, если не пришел, выдаем всех юзеров
        if (req.query.name) {
            findUsersQuery = users
                // Приводим names и query param к нижнему регистру, что бы правильно осуществлять поиск.
                // Ищем нужную нам подстроку и если ее индекс больше -1, то фильтруем и выдаем нужных пользователей
                .filter(u => u.name.toLowerCase().indexOf(req.query.name.toLowerCase()) > -1)
        }
        if (!findUsersQuery.length) {
            res.sendStatus(404)
            return
        }
        res.json(findUsersQuery.map(f => {
            return {
                id: f.id,
                name: f.name
            }
        }))
    })
// Получение определенного пользователя. :param - параметр
userRouter.get('/:id', (req: DeleteAndGetUserModule<{ id: string }>, res: Response<IGetUsers>) => {
    // параметр лежит в req.params
    // достаем id из url и превращаем его в числовое значение и находим его в json
    const findUsersById = users.find(c => c.id === +req.params.id)
    if (!findUsersById) {
        res.sendStatus(HTTP_STATUSES.NotFound404)
        return
    }
    if (+req.params.id < 0) {
        res.sendStatus(HTTP_STATUSES.BadRequest400)
        return
    }
    res.json({
        id: findUsersById.id,
        name: findUsersById.name,
    })
})
// Добавление пользователя
userRouter.post('/', (req: CreateUserModule<{ name: string }>, res: Response) => {
    console.log(req.body)
    if (!req.body.name) {
        res.sendStatus(HTTP_STATUSES.BadRequest400)
        return
    }
    const userPostQuery = {
        id: Math.floor(Math.random() * 10000),
        name: req.body.name,
        cash: 0
    }
    users.push(userPostQuery)
    res.status(HTTP_STATUSES.Created201)
        .send(userPostQuery)
})
// Удаление пользователя
userRouter.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
    const userId = +req.params.id;
    if (!userId || userId < 0) {
        res.sendStatus(HTTP_STATUSES.BadRequest400);
        return;
    }
    if (deleteUser(userId)) {
        res.sendStatus(HTTP_STATUSES.NoContent204);
    } else {
        res.sendStatus(HTTP_STATUSES.NotFound404);
    }
})
// Обновление данных у пользователя
userRouter.put('/:id', express.json(), (req: Request<{ id: string }>, res: Response) => {
    const userId = +req.params.id;
    if (!userId || userId < 0) {
        res.sendStatus(HTTP_STATUSES.BadRequest400);
        return;
    }

    // Проверяем, есть ли пользователь с указанным id
    const userToUpdate = users.find((user) => user.id === userId);
    if (!userToUpdate) {
        res.sendStatus(HTTP_STATUSES.NotFound404);
        return;
    }

    // Проверяем, есть ли новое имя пользователя в теле запроса
    const newName = req.body.name;
    if (!newName || typeof newName !== "string") {
        res.sendStatus(HTTP_STATUSES.BadRequest400);
        return;
    }

    // Обновляем имя пользователя
    userToUpdate.name = newName;

    // Возвращаем обновленного пользователя
    res.json(userToUpdate);
});

export default userRouter;