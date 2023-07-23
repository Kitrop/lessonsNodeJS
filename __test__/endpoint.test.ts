import request from "supertest";
import app from "../src/app";

const usersExpect = [
    {id: 1, name: 'Evgeniy'},
    {id: 2, name: 'Dmitriy'},
    {id: 3, name: 'Oleg'},
    {id: 4, name: 'Pavel'}
]

describe('/users', function () {
    // Проверка на получение юзеров
    it('should 200 status code and array with users', async function () {
        await request(app)
            .get('/users')
            .expect(200, usersExpect)
    })

    it('should return user with id 1 and status code 200', async function () {
        await request(app)
            .get('/users/1')
            .expect(
                200,
                {id: 1, name: 'Evgeniy'}
            )
    });

    // Проверка на то что юзера с таким id не существует
    it('should return status code 404', async function () {
        await request(app)
            .get('/users/999')
            .expect(404)
    });

    // Проверка на создание нового пользователя
    it('should return array with new user', async function () {
        // Проверяем добавление нового пользователя
        const arrNewUser = await request(app)
            .post('/users')
            .send({name: 'test user'})

        expect(arrNewUser.body).toEqual({
            id: expect.any(Number),
            name: 'test user',
            cash: 0
        })

        // Проверяем что действительно новый пользователь добавился в наши данные
        const getArrWithNewUser = await request(app)
            .get('/users')

        expect(getArrWithNewUser.body.includes({
            id: expect.any(Number),
            name: 'test user'
        }))
    })

    // Удаление пользователя и проверка, что после удаления пользователя не существует
    it('should delete user with id 1', async function () {
        await request(app)
            .delete('/users/1')
            .expect(204)

        await request(app)
            .get('/users/1')
            .expect(404)
    })

    // Проверка на то что пользователя с id 999 не существует, а также запрет на удаления пользователя с отрицательными id
    it('should return that the user was not found', async function () {
        await request(app)
            .delete('/users/999')
            .expect(404)

        await request(app)
            .delete('/users/-1')
            .expect(400)
    })

    // Проверка на обновление данных у пользователя
    it('should', async function() {
        await request(app)
            .put('/users/1')
            .send({name: 'new name'})

        const getUsers = await request(app)
            .get('/users')

        expect(getUsers.body
            .includes({
                id: 1,
                name: 'new name'
            })
        )
    })

    // Проверка ошибок на неправильное обновление данных у пользователя
    // it('should return errors', async function(){
    //     // Тест на то что пользователя с таким id не существует
    //     await request(app)
    //         .put('/users/999')
    //         .send({name: 'test'})
    //         .expect(404)
    //     // Тест на пустое name
    //     await request(app)
    //         .put('/users/1')
    //         .send({name: ''})
    //         .expect(400)
    //     // Тест на не правильный запрос
    //     await request(app)
    //         .put('/users')
    //         .send({name: 'test name'})
    //         .expect(404)
    //     // Тест на неправильный тип данных у name
    //     await request(app)
    //         .put('/users/1')
    //         .send({name: 123})
    //         .expect(400)
    // })
})