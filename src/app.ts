import express from "express";
import bodyParser from "body-parser";

// Express приложение
const app = express()

// Middleware для обработки JSON данных.
app.use(express.json())

// extended: false, означает то что будут приходить объекты
export const urlencodedParser = bodyParser.urlencoded({extended: false});

export default app;