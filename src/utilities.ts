
// Импровизированная "бд"
import {IUsers} from "./ts/types";

export let users: IUsers[] = [
    {id: 1, name: 'Evgeniy', cash: 1000},
    {id: 2, name: 'Dmitriy', cash: 1000},
    {id: 3, name: 'Oleg', cash: 1000},
    {id: 4, name: 'Pavel', cash: 1000}
]

export function deleteUser(userId: number): boolean {
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users.splice(index, 1);
        return true;
    }
    return false;
}

export const HTTP_STATUSES = {
    OK200: 200,
    Created201: 201,
    NoContent204: 204,
    NotFound404: 404,
    BadRequest400: 400,
}