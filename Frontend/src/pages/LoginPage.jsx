import React, { useState } from "react";
import { Mail, Lock, ChevronRight, MessageCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import useAuthStore from "../store/userAuth.store.js";
import Loading from "../components/Loading.jsx";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-400/70 focus:bg-white/8";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { isLoading, login } = useAuthStore();

  const handleSubmit = function (e) {
    e.preventDefault();
    login(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex min-h-full w-full items-center justify-center p-2 sm:p-4">
      <BorderAnimatedContainer>
        <div className="w-full max-w-lg overflow-hidden rounded-[28px] text-white shadow-2xl shadow-emerald-950/25">
          <div className="flex flex-col">
            <section className="w-full p-5 sm:p-6">
              
              {/* HEADER */}
              <div className="mb-10 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl text-emerald-300 ring-1">
                  <MessageCircleIcon className="size-6" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/75">
                    ChatFlow
                  </p>
                  <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                    Welcome back
                  </h1>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit}>

                {/* EMAIL */}
                <label className="block space-y-2 mb-3">
                  <span className="text-sm font-medium text-slate-200">
                    Email address
                  </span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`${inputClassName} pl-11`}
                      required
                    />
                  </div>
                </label>

                {/* PASSWORD */}
                <label className="block space-y-2 mb-5">
                  <span className="text-sm font-medium text-slate-200">
                    Password
                  </span>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`${inputClassName} pl-11`}
                      required
                    />
                  </div>
                </label>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loading s="20" />
                  ) : (
                    <>
                      <span>Login</span>
                      <ChevronRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              {/* FOOTER */}
              <p className="mt-6 text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-emerald-300 transition hover:text-emerald-200"
                >
                  Create one
                </Link>
              </p>

            </section>
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default LoginPage;