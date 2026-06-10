import express from "express";
import cors from 'cors'
import cookieparser from 'cookie-parser'
import ENV from "./ENV.js";
import {app} from './socket.js'

const corsOptions = {
    origin: ENV.originLink || "http://localhost:5173",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(express.json());

// user routes
import userRoutes from "./routes/user.routes.js";
app.use('/api/v1/users',userRoutes)

//messages routes
import messageRouter from "./routes/message.routes.js";
app.use('/api/v1/message',messageRouter)

// group routes
import groupRouter from "./routes/group.routes.js";
app.use('/api/v1/group',groupRouter)

app.get('/',(req,res)=>{
    res.send('<h1 style="color:red; display: flex; justify-content: center; background: #f0f0f0; align-items: center; padding:80px; ">It is  working fine bro !!</h1>')
})

export default app
