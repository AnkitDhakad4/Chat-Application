import { useState, useRef } from "react";
import { Mail, Lock, Eye, EyeOff, LoaderCircleIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/userAuth.store";

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const quoteRef = useRef();
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

  if (quoteRef.current === undefined) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteRef.current = quotes[randomIndex];
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.trim().length === 0) {
      alert("Email is required");
      return;
    }
    if (password.trim().length === 0) {
      alert("Password is required");
      return;
    }

    const signInData = {
      email,
      password,
    };

    try {
      await login(signInData);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/LoginBG.png)] bg-cover p-4">
      <div className="h-[92%] w-11/12 max-w-5xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05),0_30px_60px_rgba(255,45,149,0.12)] flex bg-white overflow-hidden">
        
        <div className=" w-1/2 h-full flex flex-col p-8 justify-between bg-slate-50/50">
          <div className="w-full flex items-center gap-2">
            <img src="./Logo.png" alt="Logo png" className="size-14 object-contain" />
            <p className="text-[#FF2D78] text-4xl font-bold font-sora tracking-tight">
              Chatflow
            </p>
          </div>

          <div className="w-full my-auto py-6 flex flex-col gap-3">
            <p className="font-sora font-extrabold text-3xl md:text-4xl text-[#0F0F1A] leading-tight">
              Welcome Back to Chatflow
            </p>
            <p className="font-inter text-[#1E1E30] font-light text-sm leading-relaxed opacity-80 italic">
              "{quoteRef.current}"
            </p>
          </div>

          <div className="w-full overflow-hidden rounded-xl flex-1 max-h-[50%]">
            <img 
              src="./SignUpImage.png" 
              alt="Login Page Image"
              className="w-full h-full object-cover shadow-md"
            />
          </div>
        </div>

        <div className="border-gray-500/10 flex-shrink-0 my-1 border" />

        <div className="w-1/2 h-full px-8 py-6 flex flex-col justify-between overflow-y-auto bg-slate-50/50">
          <div className="flex-1 flex flex-col justify-center gap-5 w-full">
            <div className="w-full text-[#0F0F1A] px-1">
              <p className="text-2xl font-sora font-bold">Account Login</p>
              <p className="font-inter text-[#1E1E30] text-sm font-extralight opacity-70 mt-1">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 h-fit px-1">
              
              <div className="w-full flex flex-col gap-1">
                <label className="text-[#475569] font-inter text-xs font-medium pl-1">Email Address*</label>
                <div className="flex border-[#E2E8F0] border-2 rounded-xl items-center justify-between w-full h-11 gap-2 px-3 text-[#94A3B8] focus-within:border-[#FF2D78] transition-all duration-200">
                  <Mail size={20} />
                  <input
                    required
                    type="email"
                    name="email"
                    className="flex-1 bg-transparent px-1 text-sm text-[#0F0F1A] outline-none placeholder:text-slate-300"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  />              
                </div>
              </div>

              <div className="w-full flex flex-col gap-1">
                <label className="text-[#475569] font-inter text-xs font-medium pl-1">Password*</label>
                <div className="flex border-[#E2E8F0] border-2 rounded-xl items-center justify-between w-full h-11 gap-2 px-3 text-[#94A3B8] focus-within:border-[#FF2D78] transition-all duration-200">
                  <Lock size={20} />
                  <input
                    required
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className="flex-1 bg-transparent px-1 text-sm text-[#0F0F1A] outline-none placeholder:text-slate-300"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="text-[#94A3B8] hover:text-[#475569] focus:outline-none flex items-center justify-center"
                  >
                    {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="flex justify-center items-center gap-6 hover:scale-[1.01] active:scale-[0.99] duration-200 cursor-pointer h-11 w-full bg-[#FF2D78] font-inter font-medium text-sm text-[#FFFFFF] mt-3 rounded-xl shadow-sm shadow-[#FF2D78]/20"
              >
                Login {isLoading && <LoaderCircleIcon className="size-4 animate-spin"/>}
              </button>
            </form>

            <div className="w-full text-center border-t border-slate-200/60 pt-4">
              <p className="text-sm font-inter text-slate-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#FF2D78] font-semibold hover:underline ml-1">
                  Create One
                </Link>
              </p>
            </div>
          </div>

          <div className="w-full text-center pt-4 flex-shrink-0">
            <p className="text-xs font-inter text-slate-400">© 2026 Chatflow Inc. All rights reserved.</p>
          </div>

        </div>
      </div>
    </div>
  );
}