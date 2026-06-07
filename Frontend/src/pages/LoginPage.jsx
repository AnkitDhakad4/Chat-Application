import {useState,useRef} from "react";
import { Mail,LockKeyhole,EyeIcon,EyeOff, Eye,LoaderCircle } from "lucide-react";
import {Link,useNavigate} from 'react-router-dom'
import useAuthStore from "../store/userAuth.store";

export default function LoginPage() {

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const eyeRef=useRef(null)

  const {login,isLoading}=useAuthStore()

  // const handleClickOnEye=()=>{
  //   eyeRef.current.click()

  // }

  const quoteRef=useRef()
  const quotes = [
  "Every great conversation starts with a single message.",
  "Connect instantly. Communicate effortlessly.",
  "Where ideas meet conversations.",
  "Turn messages into meaningful connections.",
  "Stay close, no matter the distance.",
  "Your next conversation is one click away.",
  "Chat smarter. Connect better.",
  "Bringing people together, one message at a time.",
  "Conversations that keep the world moving.",
  "Simple chats. Strong connections.",
  "Start talking. Start connecting.",
  "Messages travel fast. Relationships last longer.",
  "Communication made beautifully simple.",
  "Every message matters.",
  "The fastest way to stay connected."
];

if(quoteRef.current==undefined){
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteRef.current=quotes[randomIndex]
}



const navigate=useNavigate()
const handleSignIn=async ()=>{

if(email.trim().length==0 ){
  alert("Email must be required")
  return
}
if(password.trim().length==0){
  alert("Password must be required")
  return
}

  const signInData={
    email,
    password
  }

  // console.log(signInData)
  
  try{
      await login(signInData)
      navigate('/')
  }catch(err){
    console.log(err)
  }
}



  return (
    <div className="h-full w-full flex flex-col items-center bg-[url('./LoginBG.png')] bg-cover  p-2 font-space ">
      <div className=" h-fit w-1/2 flex flex-col items-center gap-2.5 ">
        <img src="./Logo.png" alt="logo image" className="size-15 rounded-xl" />
        <div className=" flex flex-col items-center">
          <p className=" text-3xl font-extrabold">Chatflow</p>
          <p className=" text-xs font-extralight text-center  ">
            Ankit Dhakad
          </p>
        </div>
      </div>

      {/* form section */}
      <div className=" h-fit w-1/2 flex justify-center p-4 ">
        <div className="bg-[#FFFFFF] w-6/10 h-full flex flex-col items-center  pt-5 gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.08),0_50px_60px_rgba(255,45,149,0.15)] rounded-xl">

          <div className=" h-fit w-9/10 flex flex-col gap-1.5 p-4">
            <label className="text-[#475569] font pl-2">Email Address</label>
            <div className="flex border-[#E2E8F0] border-2  rounded-xl items-center justify-between w-full h-11  gap-1 px-3 text-[#94A3B8]  focus-within:border-[#FF2D78] ">
              <Mail />
              <input
                required
                type="email"
                className="flex-1 bg-none rounded-xl px-1.5 w-7/10 h-8 border-[#E2E8F0] outline-none "
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>{setEmail(e.target.value.toLowerCase())}}
              />
            </div>
          </div>


          <div className=" h-fit w-9/10 flex flex-col gap-1.5 p-4">
              <label className="text-[#475569]  pl-2">Password</label>
              <div className="flex border-[#E2E8F0] border-2  rounded-xl items-center justify-between w-full h-11  gap-1 px-3 text-[#94A3B8] focus-within:border-[#FF2D78]">
              <LockKeyhole />
              <input
              required
                type={passwordVisible ? "text" :"password"}
                className="flex-1 w-7/10 h-8 rounded-xl px-1.5 flex border-[#E2E8F0] outline-none "
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
                placeholder="********"
              />
              <button  onClick={()=>{setPasswordVisible(()=>!passwordVisible)}} >{passwordVisible ? <EyeIcon /> : <EyeOff />}</button>

            </div>

            <button 
            onClick={handleSignIn}
            className="flex justify-center items-center gap-4 hover:scale-101  duration-500 cursor-pointer h-fit w-9/10 bg-[#FF2D78] font-inter text-[#FFFFFF] px-2 py-1 self-center  rounded-2xl my-6 ">Login {isLoading && <LoaderCircle className="animate-spin size-4"/>}</button>


            <p className="text-center text-xs  font-extralight " >"{quoteRef.current}"</p>
          </div>
        </div>
      </div>
      <div className=" h-2/10 w-1/2 flex flex-col items-center justify-between pt-5">
      <div>
        <p className="text-center">Don`t have an account? <Link className="text-[#FF2D78] hover:underline hover:cursor-pointer hover:scale-105 " to={'/signup'}>CreateOne</Link></p>
        </div>

        <p className="p-2">© 2026 Chatflow Inc. All rights reserved.</p>
        
        </div>
    </div>
  );
}


