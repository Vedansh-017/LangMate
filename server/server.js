import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import passport from "passport";
import bodyParser from "body-parser";
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import session from "express-session";
import "./config/passport.js";
import userRouter from "./routes/userRoutes.js";
const PORT= process.env.PORT || 4000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(bodyParser.json());

await connectDB()
const allowedOrigins = [
    'http://localhost:5173', // React app
     // Replace with your production domain
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));



app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // change to true if using https
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>  res.send("DDSTHA"));
app.use('/api/auth',authRouter);
app.use("/api/user", userRouter);



app.listen(PORT, ()=> console.log('Server Running on PORT ' + PORT));
