const http = require('http')

let requestsCount = 0

// создаем сервер
const server = http.createServer((request, response) => {
    switch (request.url) {
        case '/students': {
            response.write('students ' + requestsCount)
            break
        }
        case '/lessons': {
            response.write('lessons ' + requestsCount)
            break
        }
        default: {
            response.write('404 not found')
        }
    }
    requestsCount++
    // записываем в респонс данные
    // заканчиваем соединение
    response.end()
})

// запуск сервера
server.listen(3003)