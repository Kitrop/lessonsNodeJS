"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3003;
// Парсер, устанавливает значение парсера
// extended: false, означает то что будут приходить объекты
const urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
const jsonMiddleware = express_1.default.json();
app.use(jsonMiddleware);
let users = [
    { id: 1, name: 'Evgeniy' },
    { id: 2, name: 'Dmitriy' },
    { id: 3, name: 'Oleg' },
    { id: 4, name: 'Pavel' },
];
const HTTP_STATUSES = {
    OK200: 200,
    Created201: 201,
    NoContent204: 204,
    NotFound404: 404,
    BadRequest400: 400,
};
// Получение стандартной страницы
app.get('/', (req, res) => {
    res.send('hello world');
});
// Получение пользователей
app.get('/users', (req, res) => {
    let findUsersQuery = users;
    // если пришел query parameter, если не пришел, выдаем всех юзеров
    if (req.query.name) {
        findUsersQuery = users
            // Приводим names и query param к нижнему регистру, что бы правильно осуществлять поиск.
            // Ищем нужную нам подстроку и если ее индекс больше -1, то фильтруем и выдаем нужных пользователей
            // @ts-ignore
            .filter(u => u.name.toLowerCase().indexOf(req.query.name.toLowerCase()) > -1);
    }
    if (!findUsersQuery.length) {
        res.sendStatus(404);
        return;
    }
    res.json(findUsersQuery);
});
// Получение определенного пользователя
// :param - параметр
app.get('/users/:id', (req, res) => {
    // параметр лежит в req.params
    // достаем id из url и превращаем его в числовое значение и находим его в json
    const findUsersById = users.find(c => c.id === +req.params.id);
    if (!findUsersById) {
        res.sendStatus(HTTP_STATUSES.NotFound404);
        return;
    }
    res.json(findUsersById);
});
// Добавление пользователя
app.post('/users', urlencodedParser, (req, res) => {
    if (!req.body.name) {
        res.sendStatus(HTTP_STATUSES.BadRequest400);
        return;
    }
    const userPostQuery = {
        id: Math.floor(Math.random() * 10000),
        name: req.body.name
    };
    users.push(userPostQuery);
    res.status(HTTP_STATUSES.Created201).send(userPostQuery);
});
// Удаление пользователя
app.delete('/users/:id', (req, res) => {
    // Обработчик ошибки при отсутствии параметра
    if (!req.params.id) {
        res.sendStatus(HTTP_STATUSES.BadRequest400);
        return;
    }
    // Обработчик ошибки если удаляемый пользователь не найден
    if (!(users.find(u => u.id === +req.params.id))) {
        res.sendStatus(HTTP_STATUSES.NotFound404);
        return;
    }
    // удаляем из массива с юзерами, запрашиваемого пользователя
    users = users.filter(c => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NoContent204);
});
// Изменяем имя юзера с помощью PUT
app.put('/users/:id', urlencodedParser, (req, res) => {
    if (!req.params.id) {
        res.sendStatus(HTTP_STATUSES.BadRequest400);
        return;
    }
    if (!req.body.name) {
        res.sendStatus(400);
        return;
    }
    const findUsersById = users.find(c => c.id === +req.params.id);
    console.log(findUsersById);
    if (!findUsersById) {
        res.sendStatus(HTTP_STATUSES.NotFound404);
        return;
    }
    findUsersById.name = req.body.name;
    res.send(findUsersById);
});
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
