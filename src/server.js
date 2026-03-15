import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from './routes/auth.js';

const app = express();
app.use(express.json());
dotenv.config()


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(`Connection database failed : ${err}`))

app.use('/api/users', userRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`The server is running on localhost:${PORT} ...`)
})