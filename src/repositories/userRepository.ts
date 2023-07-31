import {HTTP_STATUSES} from "../utilities";
import {User} from "../models/UserModel";

import userDBQuery from "../db/userDB";

export const usersRepository = {
    async giveUsers(name: string | null) {
        let findUsers = await userDBQuery.giveUsers()
        if (name) {
            // Создаем регулярное выражение с опцией "i" (регистро-независимый поиск)
            const searchRegex = new RegExp(name, "i")
            findUsers =  await userDBQuery.giveUsersByUsername(searchRegex)
        }
        if (!findUsers) {
            return {
                data: {},
                status: HTTP_STATUSES.NotFound404
            }
        }
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
    async giveUserById(id: string) {
        function findId(u: any, id: string) {
            return u.id === id
        }
        const findUsersById = await userDBQuery.giveUserById(id)
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
    async createUser(name: string, password: string) {
        const user = await userDBQuery.createUser(name, password)
        return {
            data: user,
            status: 201
        }
    },
    async deleteUser(id: string) {
        const deletedCount = await userDBQuery.deleteUser(id)
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
    async updateUser(id: string, name: string) {
        const user = await userDBQuery.updateUser(id, name)

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