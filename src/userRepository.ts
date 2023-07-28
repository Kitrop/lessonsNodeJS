import {IUsers} from "./ts/types";
import {deleteUser, HTTP_STATUSES} from "./utilities";

export let users: IUsers[] = [
    {id: 1, name: 'Evgeniy', cash: 1000},
    {id: 2, name: 'Dmitriy', cash: 1000},
    {id: 3, name: 'Oleg', cash: 1000},
    {id: 4, name: 'Pavel', cash: 1000}
]

export const usersRepository = {
    giveUsers(name: string | null) {
        let findUsers = users
        // если пришел query parameter, если не пришел, выдаем всех юзеров
        if (name) {
            findUsers = users
                // Приводим names и query param к нижнему регистру, что бы правильно осуществлять поиск.
                // Ищем нужную нам подстроку и если ее индекс больше -1, то фильтруем и выдаем нужных пользователей
                .filter(u => u.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
        }
        if (!findUsers.length) {
            return {
                status: HTTP_STATUSES.NotFound404,
                data: {}
            }
        }
        const findUsersData = findUsers.map(f => {
            return {
                id: f.id,
                name: f.name
            }
        })
        return {
            status: HTTP_STATUSES.OK200,
            data: findUsersData
        }
    },
    giveUserById(id: string) {
        // параметр лежит в req.params
        // достаем id из url и превращаем его в числовое значение и находим его в json
        const findUsersById = users.find(c => c.id === +id)
        if (!findUsersById) {
            return {
                data: {},
                status: HTTP_STATUSES.NotFound404
            }
        }
        if (+id < 0) {
            return {
                data: {},
                status: HTTP_STATUSES.BadRequest400
            }
        }
        return {
            data: {
                id: findUsersById.id,
                name: findUsersById.name,
            },
            status: HTTP_STATUSES.OK200
        }
    },
    createUser(name: string) {
        const userPostQuery = {
            id: Math.floor(Math.random() * 10000),
            name: name,
            cash: 0
        }
        users.push(userPostQuery)
        return {
            data: userPostQuery,
            status: 201
        }
    },
    deleteUser(id: string) {
        const userId = +id;
        if (userId < 0) {
            return {
                data: {},
                status: HTTP_STATUSES.NotFound404
            }
        }
        if (deleteUser(userId)) {
            return {
                data: {},
                status: HTTP_STATUSES.NoContent204
            }
        } else {
            return {
                data: {},
                status: HTTP_STATUSES.NotFound404
            }
        }
    },
    updateUser(id: string, name: string) {
        const userId = +id;
        const newName = name;

        // Проверяем, есть ли пользователь с указанным id
        const userToUpdate = users.find((user) => user.id === userId);
        if (!userToUpdate) {
            return {
                data: 'invalid id, user not found',
                status: HTTP_STATUSES.NotFound404
            }
        }

        // Обновляем имя пользователя
        userToUpdate.name = newName;

        // Возвращаем обновленного пользователя
        return {
            data: userToUpdate,
            status: HTTP_STATUSES.OK200
        }
    }
}