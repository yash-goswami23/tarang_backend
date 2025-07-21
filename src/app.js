import express from 'express';
import cors from 'cors';
import musicRouter from './routes/music.routes.js';
import userRouter from './routes/user.routes.js';
import { errorHandler } from './middlewares/error.handle.middleware.js';
import cookieParser from "cookie-parser";
import helmet from 'helmet';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));


app.use(helmet());
app.use(cookieParser());
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));


app.use("/api/v1/musics", musicRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler)

export {app}