import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUserId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      setUserId(data.id); // pass userId to App
      navigate("/todo");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <form
        className="bg-white p-8 rounded-xl shadow-md w-96"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
          Login
        </h2>
        <input
          className="w-full p-3 mb-3 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-3 mb-3 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full p-3 bg-purple-600 text-white rounded hover:bg-purple-700">
          Login
        </button>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-purple-600 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
