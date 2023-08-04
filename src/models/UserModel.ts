import {model, Schema} from 'mongoose'
import {ISchemaUser} from "../ts/types";


const UserModel = new Schema<ISchemaUser>({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
})

export const User = model<ISchemaUser>('User', UserModel)
