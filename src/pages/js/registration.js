const emailReg = document.querySelector('#email')
const usernameReg = document.querySelector('#username')
const passReg = document.querySelector('#password')
const passRepeatReg = document.querySelector('#passwordRepeat')
const btnConfirm = document.querySelector('#btn')
const form = document.querySelector('#form')

const registration = (event) => {
    event.preventDefault()

    // Получаем значения из input
    const emailVal = emailReg.value
    const usernameVal = usernameReg.value
    const passVal = passReg.value
    const passRepeatVal = passRepeatReg.value

    // Находим html элементы связанные с ошибками, для того что бы ошибки не дублировались
    const msgPass = document.getElementById("msgPass")
    const msgEmpty = document.getElementById("msgEmpty")
    // Если они есть удаляем их
    if (msgPass) msgPass.remove()
    if (msgEmpty) msgEmpty.remove()

    // Если все поля заполнены
    if (emailVal && usernameVal && passVal && passRepeatVal) {

        // Если пароли совпадают
        if (passVal === passRepeatVal) {

            // Отправляем POST запрос на регистрацию, отправляю username, email и пароль
            fetch('http://localhost:3003/api/registration', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json' // Указываем заголовок для передачи JSON
                }, body: JSON.stringify({
                    email: emailVal, username: usernameVal, password: passVal
                })
            }).then(response => response.json()) // Парсим JSON из ответа
                .then(data => {
                    // Устанавливаем таймер на переход на логинизацию
                    setTimeout(function () {
                        window.location.href = 'http://localhost:63342/lessonsNodeJS/src/pages/login.html'
                    }, 500)
                })
                // Если есть ошибки выдаем их в консоль
                .catch(error => {
                    console.error('Error:', error)
                })
        } else {
            // Создаем div с ошибкой и показываем его пользователю
            const messagePassword = document.createElement('div')
            messagePassword.textContent = 'Пароли не совпадают'
            messagePassword.setAttribute('id', "msgPass")
            btnConfirm.insertAdjacentElement('afterend', messagePassword)
        }

    } else {
        // Создаем div с ошибкой и показываем его пользователю
        const messageEmpty = document.createElement('div',)
        messageEmpty.textContent = 'Не все поля заполнены'
        messageEmpty.setAttribute('id', "msgEmpty")
        btnConfirm.insertAdjacentElement('afterend', messageEmpty)
    }
}
