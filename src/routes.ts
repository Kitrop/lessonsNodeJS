import {Express, Request, Response} from "express";
import {DeleteAndGetUserModule, GetUsersModule, IGetUsers, IUsers, UpdateUserModule} from "./ts/types";
import {urlencodedParser} from "./app";


// Импровизированная "бд"
let users: IUsers[] = [
    {id: 1, name: 'Evgeniy', cash: 1000},
    {id: 2, name: 'Dmitriy', cash: 1000},
    {id: 3, name: 'Oleg', cash: 1000},
    {id: 4, name: 'Pavel', cash: 1000}
]
export const HTTP_STATUSES = {
    OK200: 200,
    Created201: 201,
    NoContent204: 204,
    NotFound404: 404,
    BadRequest400: 400,
}


const userRoutes = (app: Express) => {
    // Получение стандартной страницы
    app.get('/', (req: Request, res: Response) => {
        res.send('hello world')
        res.sendStatus(HTTP_STATUSES.OK200)
    })
    // Получение пользователей
    app.get('/users', (req: GetUsersModule<{ name: string }>, res: Response<IGetUsers[]>) => {
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
    // Получение определенного пользователя
    // :param - параметр
    app.get('/users/:id', (req: DeleteAndGetUserModule<{ id: string }>, res: Response<IGetUsers>) => {
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
    app.post('/users', (req: Request, res: Response) => {
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
    app.delete('/users/:id', (req: DeleteAndGetUserModule<{ id: string }>, res: Response) => {
        // Обработчик ошибки при отсутствии параметра
        if (!req.params.id) {
            res.sendStatus(HTTP_STATUSES.BadRequest400)
            return
        }
        if (+req.params.id < 0) {
            res.sendStatus(HTTP_STATUSES.BadRequest400)
            return
        }
        // Обработчик ошибки если удаляемый пользователь не найден
        if (!(users.find(u => u.id === +req.params.id))) {
            res.sendStatus(HTTP_STATUSES.NotFound404)
            return
        }
        // удаляем из массива с юзерами, запрашиваемого пользователя
        users = users.filter(c => c.id !== +req.params.id)
        res.sendStatus(HTTP_STATUSES.NoContent204)
    })
    // Изменяем имя юзера с помощью PUT
    app.put('/users/:id', urlencodedParser, (req: UpdateUserModule<{ id: string }, { name: string }>, res: Response) => {
        // Если не отправлен id
        if (!req.params.id) {
            res.sendStatus(HTTP_STATUSES.BadRequest400)
            return
        }
        // Если не отправлен name
        if (!req.body.name) {
            res.sendStatus(HTTP_STATUSES.BadRequest400)
            return
        }
        if (typeof req.body.name !== "string") {
            res.sendStatus(HTTP_STATUSES.BadRequest400)
            return
        }
        // Нахождение нужного юзера по id
        const findUsersById = users.find(c => c.id === +req.params.id)
        // Если нужный пользователь не найден
        if (!findUsersById) {
            res.sendStatus(HTTP_STATUSES.NotFound404)
            return
        }
        // Заменяем у нужного пользователя name на name который был нам отправлен
        findUsersById.name = req.body.name
        if (users) {
            res.json(findUsersById)
        } else {
            res.sendStatus(404)
        }
    })

}