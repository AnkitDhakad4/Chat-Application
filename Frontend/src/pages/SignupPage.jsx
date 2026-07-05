import { Lock, Mail, Phone, UserCircle, CalendarDays, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import authStore from '../store/userAuth.store'
import toast from "react-hot-toast";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    dob: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prvData) => ({
      ...prvData,
      [name]: value
    }));
  };

  const {signup,isLoading} =authStore()
  const handleSubmit = async(e) => {
    e.preventDefault();
    try
    {
      await signup(formData)
    }catch(error)
    {
      console.log(error)
      toast.error(error?.message)
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/LoginBG.png)] bg-cover p-4">
      <div className="h-[92%] w-11/12 max-w-5xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05),0_30px_60px_rgba(255,45,149,0.12)] flex bg-white overflow-hidden">
        
        <div className="w-1/2 h-full flex flex-col p-8 justify-between bg-slate-50/50">
          <div className="w-full flex items-center gap-2">
            <img src="./Logo.png" alt="Logo png" className="size-14 object-contain" />
            <p className="text-[#FF2D78] text-4xl font-bold font-sora tracking-tight">
              Chatflow
            </p>
          </div>

          <div className="w-full my-auto py-6 flex flex-col gap-3">
            <p className="font-sora font-extrabold text-3xl md:text-4xl text-[#0F0F1A] leading-tight">
              Where chat flows and connection happens
            </p>
            <p className="font-inter text-[#1E1E30] font-light text-sm leading-relaxed opacity-80">
              Join today and discover connections that matter more every day.
            </p>
          </div>

          <div className="w-full overflow-hidden rounded-xl flex-1 max-h-[50%]">
            <img 
              src="./SignUpImage.png" 
              alt="Signup Page Image"
              className="w-full h-full object-cover shadow-md"
            />
          </div>
        </div>

        <div className="border-gray-500/10 flex-shrink-0 my-1 border" />

        <div className="w-1/2 h-full px-8 flex flex-col justify-center gap-5 overflow-y-auto bg-slate-50/50">
          <div className="w-full text-[#0F0F1A] px-1">
            <p className="text-2xl font-sora font-bold">Create your account</p>
            <p className="font-inter text-[#1E1E30] text-sm font-extralight opacity-70 mt-1">
              Start your journey with Chatflow today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 h-fit px-1">
            
            <div className="w-full flex flex-col gap-1">
              <label className="text-[#475569] font-inter text-xs font-medium pl-1">Name*</label>
              <div className="flex border-[#E2E8F0] border-2 rounded-xl items-center justify-between w-full h-11 gap-2 px-3 text-[#94A3B8] focus-within:border-[#FF2D78] transition-all duration-200">
                <UserCircle size={20} />
                <input
                  required
                  type="text"
                  name="name"
                  className="flex-1 bg-transparent px-1 text-sm text-[#0F0F1A] outline-none placeholder:text-slate-300"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />              
              </div>
            </div>

            <div className="w-full flex flex-col gap-1">
              <label className="text-[#475569] font-inter text-xs font-medium pl-1">Email*</label>
              <div className="flex border-[#E2E8F0] border-2 rounded-xl items-center justify-between w-full h-11 gap-2 px-3 text-[#94A3B8] focus-within:border-[#FF2D78] transition-all duration-200">
                <Mail size={20} />
                <input
                  type="email"
                  required
                  name="email"
                  className="flex-1 bg-transparent px-1 text-sm text-[#0F0F1A] outline-none placeholder:text-slate-300"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />              
              </div>
            </div>

            <div className="w-full flex flex-col gap-1">
              <label className="text-[#475569] font-inter text-xs font-medium pl-1">Password*</label>
              <div className="flex border-[#E2E8F0] border-2 rounded-xl items-center justify-between w-full h-11 gap-2 px-3 text-[#94A3B8] focus-within:border-[#FF2D78] transition-all duration-200">
                <Lock size={20} />
                <input
                  type="password"
                  required
                  name="password"
                  className="flex-1 bg-transparent px-1 text-sm text-[#0F0F1A] outline-none placeholder:text-slate-300"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />              
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <div className="w-1/2 flex flex-col gap-1">
                <label className="text-[#475569] font-inter text-xs font-medium pl-1">Contact</label>
                <div className="flex border-[#E2E8F0] border-2 rounded-xl items-center justify-between w-full h-11 gap-2 px-3 text-[#94A3B8] focus-within:border-[#FF2D78] transition-all duration-200">
                  <Phone size={20} />
                  <input
                    type="number"
                    name="contact"
                    maxLength={10}
                  
                    className="flex-1 bg-transparent px-1 text-sm text-[#0F0F1A] outline-none placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Enter your contact"
                    value={formData.contact}
                    onChange={handleChange}
                  />              
                </div>
              </div>

              <div className="w-1/2 flex flex-col gap-1">
                <label className="text-[#475569] font-inter text-xs font-medium pl-1">Date of Birth</label>
                <div className="flex border-[#E2E8F0] border-2 rounded-xl items-center justify-between w-full h-11 gap-2 px-3 text-[#94A3B8] focus-within:border-[#FF2D78] transition-all duration-200">
                  <CalendarDays size={20} />
                  <input
                    type="date"
                    name="dob"
                    className="flex-1 bg-transparent px-1 text-sm text-[#0F0F1A] outline-none"
                    value={formData.dob}
                    onChange={handleChange}
                    min="1960-01-01"
                    max="2005-12-31"
                  />              
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="flex justify-center items-center gap-6 hover:scale-[1.01] active:scale-[0.99] duration-200 cursor-pointer h-11 w-full bg-[#FF2D78] font-inter font-medium text-sm text-[#FFFFFF] mt-3 rounded-xl shadow-sm shadow-[#FF2D78]/20"
            >
              Create Account {isLoading && <LoaderCircleIcon className="size-4 animate-spin"/>}
            </button>
          </form>

          <div className="w-full text-center border-t border-slate-200/60 pt-4">
            <p className="text-sm font-inter text-slate-500">
              Already have an account?{" "}
              <a href="/login" className="text-[#FF2D78] font-semibold hover:underline ml-1">
                Login
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SignupPage;