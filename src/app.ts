import mongoose from "mongoose";
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv'
dotenv.config();

import Router from './routes/index';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', Router);

mongoose
    .connect(`${process.env.MONGODB_URI}`, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    })
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err: any) =>
        console.error(
            "Unable to connect to Database...",
            err.message,
        )
    );

// const port = process.env.PORT || 4500;
// app.listen(port, () => console.log(`Listening on port ${port}...`));

export default app;
