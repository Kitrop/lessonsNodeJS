import {HTTP_STATUSES} from "../utilities";
import {User} from "../models/UserModel";

import userDBQuery from "../db/userDB";

export const usersRepository = {
    // Выдача пользователей
    async giveUsers(name: string | null) {
        // Получаем пользователей
        let findUsers = await userDBQuery.giveUsers()
        // Если есть query параметр с именем
        if (name) {
            // Создаем регулярное выражение с опцией "i" (регистро-независимый поиск)
            const searchRegex = new RegExp(name, "i")
            // Получаем пользователей по поиску имени
            findUsers =  await userDBQuery.giveUsersByUsername(searchRegex)
        }
        // Если пользователи не найдены
        if (!findUsers) {
            return {
                data: {},
                status: HTTP_STATUSES.NotFound404
            }
        }
        // Перебираем данные не выдавая пароль и количество денег
        const findUsersData = findUsers.map(f => {
            return {
                id: f._id,
                username: f.username
            }
        })
        return {
            status: HTTP_STATUSES.OK200,
            data: findUsersData
        }
    },
    // Выдача пользователя по айди
    async giveUserById(id: string) {
        // Получаем пользователя передавая айди
        const findUsersById = await userDBQuery.giveUserById(id)
        // Если пользователь не найден
        if (!findUsersById) {
            return {
                data: 'user not found',
                status: HTTP_STATUSES.NotFound404
            }
        }
        return {
            data: {
                _id: findUsersById._id,
                username: findUsersById.username,
            },
            status: HTTP_STATUSES.OK200
        }
    },
    // Передача данных для создания пользователя
    async createUser(name: string, password: string) {
        // Передаем имя и пароль, получаем созданного пользователя
        const user = await userDBQuery.createUser(name, password)
        return {
            data: user,
            status: 201
        }
    },
    // Передача айди пользователя которого нужно удалить
    async deleteUser(id: string) {
        // Передаем айди пользователя которого нужно удалить, получаем результат удаления
        const deletedCount = await userDBQuery.deleteUser(id)
        // Если удаления не произошло, то возращаем ошибку
        if (deletedCount == 0) {
            return {
                data: 'user not found',
                status: HTTP_STATUSES.NotFound404
            }
        }
        else {
            return {
                data: 'user delete',
                status: HTTP_STATUSES.NoContent204
            }
        }
    },
    // Передача данных для обновления пользователя
    async updateUser(id: string, name: string | undefined, password: string | undefined) {
        // Отправляем данные, что бы занести новые данные пользователя
        const user = await userDBQuery.updateUser(id, name, password)

        // Если пользователь не найден
        if (!user) {
            return {
                data: 'invalid id, user not found',
                status: HTTP_STATUSES.NotFound404
            }
        }

        // Обновляем имя пользователя
        user.username = name;

        // Возвращаем обновленного пользователя
        return {
            data: {
                _id: user.id,
                username: user.username
            },
            status: HTTP_STATUSES.OK200
        }
    }
}