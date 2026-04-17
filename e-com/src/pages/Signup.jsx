import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setLocalError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError("Please enter a valid email");
      return false;
    }
    if (!formData.password) {
      setLocalError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }
    if (!formData.agreeToTerms) {
      setLocalError("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    setLocalError("");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!validateForm()) return;

    dispatch(signupUser({ email: formData.email, password: formData.password }));
  };

  if (loading) {
    return <LoadingSpinner text="Creating your account..." />;
  }

  const displayError = localError || error;
  const strengthColor =
    passwordStrength === 0
      ? "bg-gray-300"
      : passwordStrength <= 2
        ? "bg-red-500"
        : passwordStrength <= 3
          ? "bg-yellow-500"
          : "bg-green-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ShopHub</h1>
            <p className="text-gray-600">Create your account to get started</p>
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
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded ${
                          i < passwordStrength ? strengthColor : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {passwordStrength <= 2
                      ? "Weak password"
                      : passwordStrength === 3
                        ? "Moderate password"
                        : "Strong password"}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
              {formData.password && formData.confirmPassword === formData.password && (
                <div className="flex items-center gap-2 mt-2 text-green-600">
                  <span className="text-xl">✅</span>
                  <span className="text-sm">Passwords match</span>
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 pt-2">
              <input
                id="agreeToTerms"
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 mt-1"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-bold transition"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;