import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">ShopHub</h3>
            <p className="text-sm text-gray-400 mb-4">
              Your one-stop destination for quality products at unbeatable prices.
            </p>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-blue-400 transition">
                f
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                𝕏
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                📷
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">
                  Cart
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                📧
                <a href="mailto:info@shophub.com" className="hover:text-white transition">
                  info@shophub.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                📞
                <a href="tel:+1234567890" className="hover:text-white transition">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2">
                📍
                <span>123 Main Street, City, State 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} ShopHub. All rights reserved.
            </p>
            <div className="flex gap-4 justify-start sm:justify-end text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
