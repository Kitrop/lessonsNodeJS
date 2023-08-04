import {User} from "../models/UserModel";
import {HTTP_STATUSES} from "../utilities";
import {UsersModel} from "../models/UsersModel";
import {sign} from "jsonwebtoken";

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
        // Дополнительная проверка на наличие хотя бы одного параметра
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

export const userAuthDB = {
    async loginUser(email: string) {
        // Находим пользователя по email
        const user = await UsersModel.findOne({email})
        return user
    },
    // Создание пользователя
    async createUser(username: string, email: string, password: string) {
        // Проверяем email и username на уникальность
        const checkUserEmail = await UsersModel.findOne({email})
        const checkUserUsername = await UsersModel.findOne({username})


        // Если проверка на уникальность прошла, создаем пользователя
        if (!checkUserEmail && !checkUserUsername) {
            const newUser = new UsersModel({
                username,
                email,
                password
            })

            // Сохраняем и возвращаем созданного пользователя
            await newUser.save()
            const payload = {
                user: {
                    _id: newUser._id
                }
            }
            sign(
                payload,
                "jewerly", {expiresIn: 10000}, (err, token) => {
                    if (err) throw err
                    console.log(token)
                }
            )

            return {
                username: newUser.username,
                email: newUser.email,
                _id: newUser._id
            }
        }

        // Выдаем ошибку если тест на уникальность провален
        let dataMsg = ''
        if (checkUserEmail) dataMsg += 'This username is already in use. '
        if (checkUserUsername) dataMsg += 'This username is already in use. '
        return {
            data: dataMsg,
            status: 400
        }
    }
}

export default userDBQuery