import {User} from "../models/UserModel";
import {HTTP_STATUSES} from "../utilities";

const userDBQuery = {
    // Получение пользователей
    giveUsers() {
        return User.find();
    },
    // Получение пользователей по имени
    giveUsersByUsername(username: RegExp) {
        return User.find({username: username})
    },
    // Получение пользователя по айди
    giveUserById(id: string) {
        return User.findOne({_id: id});
    },
    // Создание пользователя
    async createUser(username: string, password: string) {
        const user = new User({
            username: username,
            password: password,
            role: 'User'
        })
        await user.save()
        return user
    },
    // Удаление пользователя
    async deleteUser(id: string) {
        const deleteUser = await User.deleteOne({_id: id})
        return deleteUser.deletedCount
    },
    // Обновление пользователя
    async updateUser(id: string, username: string | undefined, password: string | undefined) {
        const user = await User.findOne({_id: id})

        // Если пользователь не найден
        if (!user) {
            return {
                data: 'invalid id, user not found',
                status: HTTP_STATUSES.NotFound404
            }
        }

        // Обновляем имя пользователя
        if (username) {
            user.username = username
        }
        if (password) {
            user.password = password
        }
        if (!username && !password) {
            return {
                data: 'invalid values',
                status: HTTP_STATUSES.BadRequest400
            }
        }
        user.save()
        return {
            id: user._id,
            username: user.username
        }
    }
}

export default userDBQuery