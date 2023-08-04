const emailLogin = document.querySelector('#email')
const passwordLogin = document.querySelector('#password')
const btn = document.querySelector('#btn')
const header = document.querySelector('.header')

const login = (event) => {
    event.preventDefault()

    // Получаем значение из input
    const emailVal = emailLogin.value
    const passwordVal = passwordLogin.value

    // Находим html элементы связанные с ошибками
    const msgEmpty = document.querySelector('#msgEmpty')
    const msgError = document.querySelector('#msgError')
    // Если они есть удаляем их
    if (msgEmpty) msgEmpty.remove() // Для того что бы ошибки не дублировались
    if (msgError) msgError.remove()

    // Если все input заполнены
    if (emailVal && passwordVal) {

        // Отправляем POST запрос для логина пользователя, передавая email и пароль
        fetch('http://localhost:3003/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailVal,
                password: passwordVal
            })
        }).then(response => {
            // Если вход прошел успешно, то выдаем данные
            if (response.ok) {
                return response.json()
            }
            // Если нет отправляем ошибку и показываем ее пользователю
            else {
                throw new Error('Login failed. Please check your credentials.')
            }
        })
            .then(data => {

                // Находим ссылки в шапке и удаляем их из-за ненадобности
                const logLink = document.getElementById('login_link')
                const regLink = document.getElementById('registration_link')
                logLink.remove()
                regLink.remove()

                // Добавляем имя пользователя в header
                const username = document.createElement('span')
                username.setAttribute('class', 'userInfo')
                username.textContent = data.data.username
                header.insertAdjacentElement('beforeend', username)

                // Добавляем айди пользователя в header
                const userId = document.createElement('span')
                userId.setAttribute('class', 'userInfo')
                userId.textContent = data.data._id
                header.insertAdjacentElement('beforeend', userId)
            })
            .catch(error => {
                // Выводим ошибку и показываем ее пользователю
                const msgError = document.createElement('div')
                msgError.textContent = error.message
                msgError.setAttribute('id', 'msgError')
                btn.insertAdjacentElement('afterend', msgError)
            })
    }

    // Если не все поля заполнены
    else {
        // Создаем div
        const msgEmpty = document.createElement('div')
        // задаем ему соответсвующий текс
        msgEmpty.textContent = 'Не все поля заполнены'
        // даем ему id что бы можно было его удалить
        msgEmpty.setAttribute('id', 'msgEmpty')
        // вставляем ошибку
        btn.insertAdjacentElement('afterend', msgEmpty)
    }
}
