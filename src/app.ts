import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes";


// Express приложение
const app = express()

// extended: false, означает то что будут приходить объекты
export const urlencodedParser = bodyParser.urlencoded({extended: false});


// Middleware для обработки JSON данных.
app.use(express.json())

// Подключаем роутер для /users
app.use('/users', userRouter);

export default app;