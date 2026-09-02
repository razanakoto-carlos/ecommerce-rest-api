import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import './config/passport.js';
import userRouter from './routes/auth.js';
import categoryRouter from "./routes/category.js";
import productRouter from "./routes/product.js";
import cartRouter from "./routes/Cart.js"

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/upload/category", express.static("upload/category"))
app.use("/upload/products", express.static("upload/products"))

process.on("uncaughtException", (err) => {
    console.log(err)
    process.exit(1)
})

process.on("unhandledRejection", (err) => {
    console.log(err)
    process.exit(1)
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => {
        console.log(`Connection database failed : ${err}`)
        process.exit(1)
    });

app.use('/auth', userRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter)

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`The server is running on localhost:${PORT} ...`)
})