import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import { listenToAuth } from "./features/auth/authSlice";
import { loadCart } from "./features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/CartPage";
import Admin from "./pages/Admin";
import Home from "./pages/Home";

function App() {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(listenToAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(loadCart(user.uid));
    }
  }, [user?.uid, dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        {authLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <LoadingSpinner text="Initializing..." />
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-6">Page not found</p>
                    <a
                      href="/"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;