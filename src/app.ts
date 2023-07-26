import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes";
import productRouter from "./productsRoutes";


// Express приложение
const app = express()

// extended: false, означает то что будут приходить объекты
export const urlencodedParser = bodyParser.urlencoded({extended: false});


// Middleware для обработки JSON данных.
app.use(bodyParser())

// Подключаем роутер для /users
app.use('/users', userRouter);
app.use('/products', productRouter)

export default app;