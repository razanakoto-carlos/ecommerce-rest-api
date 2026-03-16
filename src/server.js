import express from "express";
import mongoose from "mongoose";
import './config/passport.js'
import userRouter from './routes/auth.js';
import categoryRouter from "./routes/category.js"


const app = express();
app.use(express.json());
app.use("/upload/category", express.static("upload/category"))

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(`Connection database failed : ${err}`))

app.use('/auth', userRouter);
app.use('/category', categoryRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`The server is running on localhost:${PORT} ...`)
})