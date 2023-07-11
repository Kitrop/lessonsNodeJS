const http = require('http')
const fs = require('fs')

// асинхронный таймер
const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

// Создаем промис который читает файлы асинхроно
const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })
}

const server = http.createServer(async (request, response) => {
    switch (request.url) {
        case '/home': {
            try {
                const data = await readFile('pages/home.html')
                response.write(data)
            } catch (err) {
                response.write('some err')
            } finally {
                response.end()
            }

            break
        }
        case '/about': {
            try {
                await delay(3000)
                const data = await readFile('pages/about.html')
                response.write(data)
            } catch (err) {
                response.write('some err')
            } finally {
                response.end()
            }
            break
        }
        default: {
            response.write('404')
            response.end()
        }
    }
})

server.listen(3003)