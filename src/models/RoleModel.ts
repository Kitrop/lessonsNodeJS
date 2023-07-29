import {model, Schema} from "mongoose";
import {ISchemaRole} from "../ts/types";

const ISchemaRole = new Schema<ISchemaRole>({
    value: {type: String, required: true, default: 'User'}
})

export const Role = model<ISchemaRole>('Role', ISchemaRole)

