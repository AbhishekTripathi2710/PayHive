import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background-light font-display">

            {/* LEFT IMAGE PANEL */}
            <div className="relative hidden lg:flex flex-col justify-between p-8 text-white">

                {/* BRAND LOGO */}
                <div className="z-10 flex items-center gap-3">
                    {/* Replace material-symbols with normal text */}
                    <span className="text-2xl font-bold">PayHive</span>
                </div>

                {/* WELCOME MESSAGE */}
                <div className="z-10">
                    <h1 className="text-[32px] font-bold leading-tight text-white">Welcome Back</h1>
                    <p className="text-gray-200 text-base pt-1">
                        Log in to continue to your dashboard.
                    </p>
                </div>

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

                {/* BACKGROUND IMAGE */}
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0cg5ptmZKmKqv3BUttmK4yme4Crg6Ye1thfckzOb4CZg2trVTtpieSHaSinxksIQoOTWXzaSxPIx4FjazPmIJSpSl7KwtxwqkcLBo4SRklw-bjLicm0yINUh91U8Ok4kbQu7Onf4frqb6IwnhAHPpCIQVjtKdSFpUeN6pITNssAsK2fLAgAqSjLSRgPwsGbFiqrz19rjFGJW50XdmOeQGAZivp3HeVG8KlbDmrGpUFyKBWopaKcFILmv0p4DYqPBETUqGPv9mfgKW"
                    alt=""
                />
            </div>

            {/* RIGHT SIDE PANEL */}
            <div className="flex items-center justify-center p-6 sm:p-12">
                <div className="flex w-full max-w-md flex-col items-center gap-8">

                    {/* MOBILE HEADER */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <span className="text-2xl font-bold text-slate-700">PayHive</span>
                    </div>

                    {/* LOGIN CARD */}
                    <div className="flex w-full flex-col gap-8 rounded-xl bg-white p-8 lg:p-10 shadow-sm border border-gray-200">

                        {/* TITLE */}
                        <div className="flex flex-col gap-2 text-center lg:text-left">
                            <h1 className="text-[22px] font-bold text-slate-800 leading-tight">
                                Sign In
                            </h1>
                            <p className="text-slate-500">
                                Enter your credentials to access your account.
                            </p>
                        </div>

                        {/* FORM */}
                        <div className="flex flex-col gap-6">

                            {/* EMAIL */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 
                             text-slate-700 placeholder:text-gray-400 
                             focus:border-primary focus:ring-primary/50 bg-white"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* PASSWORD */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3
                               text-slate-700 placeholder:text-gray-400 
                               focus:border-primary focus:ring-primary/50 bg-white"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button className="absolute inset-y-0 right-0 pr-4 text-gray-500">
                                        <span className="material-symbols-outlined">
                                            {password ? "visibility_off" : "visibility"}
                                        </span>

                                    </button>
                                </div>
                            </div>

                            {/* OPTIONS */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input type="checkbox" className="h-4 w-4 rounded text-primary" />
                                    Remember Me
                                </label>

                                <span className="text-primary text-sm font-medium cursor-pointer">
                                    Forgot Password?
                                </span>
                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                onClick={handleLogin}
                                className="w-full py-3 rounded-lg bg-black text-white font-bold text-center hover:bg-black/90 "
                            >
                                Login
                            </button>

                            {/* DIVIDER */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <button className="flex items-center justify-center gap-3 rounded-lg border border-gray-300 
                                 bg-white py-3 text-sm text-slate-700 hover:bg-gray-100">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25C22.56 11.45 22.49..." />
                                </svg>
                                Continue with Google
                            </button>
                        </div>

                        {/* FOOTER */}
                        <p className="text-center text-sm text-slate-500">
                            Don’t have an account?{" "}
                            <span
                                className="text-primary font-medium cursor-pointer"
                                onClick={() => navigate("/register")}
                            >
                                Sign Up
                            </span>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}
