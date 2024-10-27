import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Auth from './routes/auth.js';
import Register from './routes/register.js';
import Logout from './routes/logout.js';
import createClassroom from './routes/createClassroom.js';
import userRoutes from "./routes/user.js";
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
    res.status(200).json({ "msg": "working" });
    return;
})

app.use("/auth", Auth);

app.use("/user", userRoutes);

app.use("/register", Register);

<<<<<<< HEAD
app.use('/createClassroom', createClassroom)
=======
app.use("/logout", Logout);

app.use('/createClassroom',createClassroom)
>>>>>>> e73594a2d3ade0c4c7f2c32547d6738bd23e6f4a

app.listen(3000, () => {
    console.log("Server is running");
})