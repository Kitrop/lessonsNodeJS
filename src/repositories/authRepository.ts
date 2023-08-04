import {userAuthDB} from "../db/userDB";
import {HTTP_STATUSES} from "../utilities";
import {compare, hash} from "bcryptjs";
import {sign} from "jsonwebtoken";

export const authRepository = {
    // Вход пользователя
    async loginUser(email: string, password: string) {
        // Отправка запрос
        const user = await userAuthDB.loginUser(email)
        // Если пользователь с таким email был найден
        if (user) {

            // Проверка на правильность пароля, расшифровываем пароль и сравниваем с данным паролем
            const isMatch = await compare(password, user.password)
            // Если пароль не правильный
            if (!isMatch) {
                return {
                    data: 'Incorrect password',
                    status: 401
                }
            }
            // Если пароль правильный
            else {
                const payload = {
                    user: {
                        _id: user._id
                    }
                }

                // получаем токен, что бы его дальше отправить
                const tokenUser = await new Promise<string>((resolve, reject) => {
                    sign(payload, "jewerly", { expiresIn: 3600 }, (err, token) => {
                        if (err) reject(err)
                        resolve(token || "")
                    })
                })
                return {
                    data: {
                        _id: user._id,
                        username: user.username,
                        email: user.email
                    },
                    token: tokenUser,
                    status: 200
                }
            }
        }
        else {
            return {
                data: 'User not exist',
                status: 401
            }
        }
    },

    // Создание пользователя
    async createUser(username: string, email: string, password: string) {
        // шифруем пароль
        const hashpass = await hash(password, 7)
        const newUser = await userAuthDB.createUser(username, email, hashpass)

        // Если создание прошло успешно
        if (!newUser.status) {
            return {
                data: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email
                },
                status: HTTP_STATUSES.Created201
            }
        }
        // Если создание не прошло успешно
        else {
            return {
                data: newUser.data,
                status: newUser.status
            }
        }
    }
}