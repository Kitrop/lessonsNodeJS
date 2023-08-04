import app from "./app";
import {connect, ConnectOptions} from 'mongoose'

const port = process.env.PORT || 3003
const uri = "mongodb+srv://veryyoshicool:9265@cluster0.ksk53e9.mongodb.net/?retryWrites=true&w=majority"



async function run() {
    console.log('!!!!')
    try {
        await connect(uri, {
            useNewUrlParser: true,
        } as ConnectOptions)
    }
    catch (e) {
        console.log(e)
    }
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
run()
