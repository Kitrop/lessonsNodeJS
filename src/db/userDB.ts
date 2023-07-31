import {User} from "../models/UserModel";
import {HTTP_STATUSES} from "../utilities";

const userDBQuery = {
     giveUsers() {
        return User.find();
    },
    giveUsersByUsername(username: RegExp) {
        return User.find({username: username})
    },
    giveUserById(id: string) {
        return User.findOne({_id: id});
    },
    async createUser(username: string, password: string) {
        const user = new User({
            username: username,
            password: password,
            role: 'User'
        })
        await user.save()
        return user
    },
    async deleteUser(id: string) {
        const deleteUser = await User.deleteOne({_id: id})
        return deleteUser.deletedCount
    },
    async updateUser(id: string, username: string) {
        const user = await User.findOne({_id: id})

        // Если пользователь не найден
        if (!user) {
            return {
                data: 'invalid id, user not found',
                status: HTTP_STATUSES.NotFound404
            }
        }

        // Обновляем имя пользователя
        // @ts-ignore
        user.username = username;
        user.save()
        return {
            id: user._id,
            username: user.username
        }
    }
}

export default userDBQuery