import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (password !== confirm) return alert("Passwords do not match");

    try {
      await API.post("/auth/register", { username, email, password });
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F1F5FF] font-display">

      <div className="hidden lg:flex flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">

          <div
            className="w-full aspect-square bg-cover bg-center rounded-xl shadow-md"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlEloRyGbIHnJeH5KpfgaYWh-V4PWPQG31qLoh1vWrtg0TZStCrhpS4Rv-rzmGW3d_K4VpYb2iZDXI_82v8kMcTNlum-BpaBblP5L0c4YjOWX6lG3s8rKahL4BIam-3nbrsLE7OrrTP5xh_oveWOeDZuXhuxwWQyL0v4gxmcxAk9zSb532uaLoTTjlVG3ZpvSG1maYYWgZMhtPFYBZT8I6kpWSAIhUKpmhDlmy0DyXefXMG9mt7u_Gvwz0r-0Or5oYIWbwQpC3ePCJ")'
            }}
          ></div>

          <h1 className="mt-8 text-4xl font-extrabold text-[#111418]">
            Join Our Community
          </h1>
          <p className="mt-2 text-[#475467] text-base">
            Unlock exclusive features and start collaborating today.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">

          <h2 className="text-4xl font-bold text-[#111418] mb-8">
            Create an Account
          </h2>

          <div className="flex flex-col gap-5">

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#344054]">Username</span>
              <div className="flex items-center border border-[#D0D5DD] rounded-lg bg-white px-3">
                <input
                  className="flex-1 h-12 outline-none bg-transparent placeholder:text-[#98A2B3]"
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span className="material-symbols-outlined text-[#98A2B3]">person</span>
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#344054]">Email</span>
              <div className="flex items-center border border-[#D0D5DD] rounded-lg bg-white px-3">
                <input
                  className="flex-1 h-12 outline-none bg-transparent placeholder:text-[#98A2B3]"
                  placeholder="Enter your email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="material-symbols-outlined text-[#98A2B3]">mail</span>
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#344054]">Password</span>
              <div className="flex items-center border border-[#D0D5DD] rounded-lg bg-white px-3">
                <input
                  type="password"
                  className="flex-1 h-12 outline-none bg-transparent placeholder:text-[#98A2B3]"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="material-symbols-outlined text-[#98A2B3]">lock</span>
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#344054]">Confirm Password</span>
              <div className="flex items-center border border-[#D0D5DD] rounded-lg bg-white px-3">
                <input
                  type="password"
                  className="flex-1 h-12 outline-none bg-transparent placeholder:text-[#98A2B3]"
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirm(e.target.value)}
                />
                <span className="material-symbols-outlined text-[#98A2B3]">lock</span>
              </div>
            </label>
          </div>

          <button
            onClick={handleRegister}
            className="w-full bg-primary text-white py-3 rounded-lg mt-8 text-sm font-semibold hover:bg-primary/90"
          >
            Create Account
          </button>

          <p className="text-center mt-6 text-sm text-[#475467]">
            Already have an account?{" "}
            <span
              className="text-primary cursor-pointer font-medium hover:underline"
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}
