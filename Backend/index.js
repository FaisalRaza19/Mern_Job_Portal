import express from 'express';
import session from "express-session"
import connectToDb from "./DataBase/db.js"
import cors from 'cors';
import dotenv from "dotenv"
import {router} from "./Routes/user.route.js"

const app = express();
dotenv.config({path : ".env"});
connectToDb();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
    })
);

app.get('/', (req, res) => {
  res.send('Hello world');
});
// change pass
app.get(`/change-password/:token`, (req, res) => {
  res.send('change the password');
});

app.use("/user",router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});

