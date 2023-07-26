import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/usersRoutes";
import productRouter from "./routes/productsRoutes";


// Express приложение
const app = express()

// extended: false, означает то что будут приходить объекты
export const urlencodedParser = bodyParser.urlencoded({extended: false});


// Middleware для обработки JSON данных.
app.use(bodyParser())

// Подключаем роутеры
app.use('/users', userRouter);
app.use('/products', productRouter)

export default app;