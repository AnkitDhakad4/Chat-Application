import express from "express";
import cors from 'cors'
import cookieparser from 'cookie-parser'
import ENV from "./ENV.js";

const app=express()

app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(express.json());

app.use(cors({
    originLink:ENV.originLink,
    credentials:true
}))

// user routes
import userRoutes from "./routes/user.routes.js";
app.use('/api/v1/users',userRoutes)

//messages routes
import messageRouter from "./routes/message.routes.js";
app.use('/api/v1/message',messageRouter)

app.get('/',(req,res)=>{
    res.send('<h1 style="color:red; display: flex; justify-content: center; align-items: center; padding:80px; ">It is  working fine bro !!</h1>')
})

export default app
