import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Lock,
  Mail,
  MessageCircleIcon,
  Phone,
  User,
} from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import userAuthStore from "../store/userAuth.store.js";
import Loading from "../components/Loading.jsx";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-400/70 focus:bg-white/8";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    dob: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const { signup, isLogginup, isLoading } = userAuthStore();
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Signup form submitted", formData);
    signup(formData);
  };

  return (
    <div className="w-full flex justify-center items-center p-2">
      <BorderAnimatedContainer>
        <div className="w-full max-w-2xl overflow-hidden rounded-[28px]  text-white shadow-2xl shadow-emerald-950/25">
          <div className="flex flex-col">
            <section className="w-full p-4">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl text-emerald-300 ring-1">
                  <MessageCircleIcon className="size-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/75">
                    ChatFlow
                  </p>
                  <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                    Create your account
                  </h1>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-200">
                      Full name*
                    </span>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        className={`${inputClassName} pl-11`}
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-200">
                      Email address*
                    </span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        className={`${inputClassName} pl-11`}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter you email"
                        required
                      />
                    </div>
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-200">
                      Password*
                    </span>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        className={`${inputClassName} pl-11`}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a secure password"
                        required
                      />
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-200">
                      Contact number
                    </span>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        className={`${inputClassName} pl-11`}
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Contact number"
                      />
                    </div>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-200">
                      Date of birth
                      <span className="ml-2 text-xs text-slate-400">
                        Optional
                      </span>
                    </span>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                      <input
                        className={`${inputClassName} pl-11 [color-scheme:dark]`}
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loading size="2" />
                  ) : ( 
                    <>
                      <span>Create account</span>
                      <ChevronRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-emerald-300 transition hover:text-emerald-200"
                >
                  Sign in
                </Link>
              </p>
            </section>
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default SignupPage;
