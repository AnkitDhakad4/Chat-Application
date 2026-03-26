import express from "express";
import cookieparser from 'cookie-parser'

const app=express()

app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(express.json());
app.use(cors({
    originLink:process.env.originLink,
    credentials:true
}))

app.use


app.get('/',(req,res)=>{
    res.send('<h1 style="color:red; display: flex; justify-content: center; align-items: center; padding:80px; ">It is  working fine bro !!</h1>')
})

export default app
