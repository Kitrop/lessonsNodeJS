import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/usersRoutes";
import productRouter from "./routes/productsRoutes";
import authRouter from "./routes/authRoutes";
import cors from "cors";

// Express приложение
const app = express()


// extended: false, означает то что будут приходить объекты
export const urlencodedParser = bodyParser.urlencoded({extended: false});

// Middleware для обработки JSON данных.
app.use(bodyParser())

// Добавляем middleware для CORS
app.use(cors())

// Подключаем роутеры
app.use('/users', userRouter);
app.use('/products', productRouter)
app.use('/api', authRouter)

export default app;