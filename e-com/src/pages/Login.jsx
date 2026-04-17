import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function Login() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    if (!email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Please enter a valid email");
      return false;
    }
    if (!password) {
      setLocalError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!validateForm()) return;

    dispatch(loginUser({ email, password }));
  };

  if (loading) {
    return <LoadingSpinner text="Logging in..." />;
  }

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ShopHub</h1>
            <p className="text-gray-600">Welcome back! Please login to your account</p>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <span className="text-red-600 flex-shrink-0 text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{displayError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError("");
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError("");
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition mt-6"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                <strong>Admin:</strong> admin@gmail.com / 123456
              </li>
              <li>
                <strong>User:</strong> user@example.com / 123456
              </li>
            </ul>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-bold transition"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;