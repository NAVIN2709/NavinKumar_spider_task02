import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { loginWithGoogle, login } = useAuth(); // from AuthContext

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password); // Firebase email/password login
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle(); // Get Firebase user
      const { uid, displayName, email, photoURL } = user;
      if (!user) throw new Error("error")

      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          name: displayName,
          email,
          photoURL,
        }),
      });

      if (!res.ok) throw new Error("Failed to save user");

      const userData = await res.json();
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log("User saved:", userData);

      navigate("/onboarding");
    } catch (err) {
      console.error(err);
      setError("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <img src="/logo.png" alt="Logo" className="w-32 h-32 mx-auto" />

        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Log in to continue</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white text-sm px-4 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Login
          </button>
        </form>

        <div className="flex items-center justify-center gap-2">
          <div className="h-px bg-gray-700 w-20" />
          <p className="text-sm text-gray-500">or</p>
          <div className="h-px bg-gray-700 w-20" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
