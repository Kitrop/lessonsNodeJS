import { Request } from 'express';

export type GetUsersModule<T> = Request<{}, {}, {}, T>
export type UpdateUserModule<T, D> = Request<T, {}, D, {}>
export type DeleteAndGetUserModule<T> = Request<T, {}, {}, {}>
export type CreateUserModule<T> = Request<{}, {}, T, {}>

export interface IUsers {
    id: number
    name: string
    cash: number
}

export type IGetUsers = {
    id: number,
    name: string
}

