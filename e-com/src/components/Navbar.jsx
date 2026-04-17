import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { setSearchQuery } from "../features/products/productsSlice";

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    dispatch(setSearchQuery(value));
  };

  const isAdmin = user?.email === "admin@gmail.com";
  const cartCount = cartItems.length;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-blue-600 transition"
          >
            🛒
            <span>ShopHub</span>
          </Link>

          {/* Search Bar - Desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 mx-12">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
                <span className="absolute left-3 top-3 text-gray-400">🔍</span>
              </div>
            </div>
          )}

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Home
                </Link>
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  � Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition font-medium shadow-md"
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
                  <span className="text-sm text-gray-600 truncate max-w-[150px]">
                    {user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium shadow-md"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-900 text-2xl"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 bg-gray-50 border-t border-gray-200">
            {isAuthenticated && (
              <div className="flex gap-2 px-4 pt-3">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={handleSearch}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-200 text-gray-900 text-sm focus:outline-none"
                />
              </div>
            )}
            <div className="space-y-2 px-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/cart"
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart ({cartCount})
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block text-purple-600 hover:text-purple-700 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;