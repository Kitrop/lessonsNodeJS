import {model, Schema} from "mongoose";

const UsersSchema = new Schema(({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}))

export const UsersModel = model<UsersModel>('Users', UsersSchema)

interface UsersModel {
    username: string,
    email: string,
    password: string,
    createdAt: Date
}