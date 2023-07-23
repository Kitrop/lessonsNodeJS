import app from "./app";
import userRouter from "./routes";



const port = process.env.PORT || 3003;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});