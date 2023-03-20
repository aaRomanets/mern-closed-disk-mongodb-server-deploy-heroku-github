import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

import fileUpload from "express-fileupload";
import authRouter from "./routes/authRoutes.js";
import fileRouter from "./routes/fileRoutes.js";
const app = express();

import coreMiddleware from "./middleware/corsMiddleware.js";

app.use(fileUpload({}));
app.use(coreMiddleware);
app.use(express.json());
app.use(express.static("static"));

//подключаем маршрутизаторы авторизации или регистрации
app.use("/api/auth",authRouter);

//подключаем маршрутизаторы операций с папками и файлами при авторизованном пользователе
app.use("/api/files",fileRouter);

const start = async () => {
    try {
        //подключаем базу данных
        //await mongoose.connect(config.get("dbUrl"))
        
        //подключаем базу данных Mongo DB
        await mongoose.connect(
        process.env.DB_URL,
        {
            //these are options to ensure that the connection is done properly
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        .then(() => 
        {
            console.log("Successfully connected to MongoDB Atlas!")        
        })
        .catch((error) => 
        {
            console.log("Unable to connect to MongoDB Atlas!");
            console.error(error);
        }) 
        //слушаем сервер
        app.listen(process.env.PORT || 3001, () => {
            console.log("Server started on port ", process.env.PORT || 3001)
        })
    } 
    catch(error) 
    {
        console.error(error);
    }
}

start();