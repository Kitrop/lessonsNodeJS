import app from "./app";
import {connect, connection} from 'mongoose'
import {User} from "./models/UserModel";
import {Role} from "./models/RoleModel";

const port = process.env.PORT || 3003
const uri = "mongodb+srv://veryyoshicool:9265@cluster0.ksk53e9.mongodb.net/?retryWrites=true&w=majority"



async function run() {
    console.log('!!!!')
    try {
        await connect(uri)
        const searchRegex = new RegExp('Kir', "i"); // Создаем регулярное выражение с опцией "i" (регистро-независимый поиск)
        let users = await User.find({ username: searchRegex });
    }
    catch (e) {
        console.log(e)
    }
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
run()
