"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-white hover:text-blue-200 transition">
            <Link href="/">Application Gate</Link>
          </div>

          {/* Desktop Links (hidden on mobile) */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-white hover:text-blue-200 transition">
              Home
            </Link>
            <Link href="/how-it-works" className="text-white hover:text-blue-200 transition">
              How It Works
            </Link>
            <Link href="/blog" className="text-white hover:text-blue-200 transition">
              Blog
            </Link>
            <Link href="/about" className="text-white hover:text-blue-200 transition">
              About
            </Link>
            <Link href="/privacy" className="text-white hover:text-blue-200 transition">
              Privacy
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Register
            </Link>
          </div>

          {/* Hamburger button (visible on mobile) */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              // X icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu (hidden by default, toggled by state) */}
        {menuOpen && (
          <div className="md:hidden bg-indigo-900 px-6 py-4 space-y-3">
            <Link
              href="/"
              className="block text-white hover:text-blue-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/how-it-works"
              className="block text-white hover:text-blue-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/blog"
              className="block text-white hover:text-blue-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="block text-white hover:text-blue-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="block text-white hover:text-blue-200 transition"
              onClick={() => setMenuOpen(false)}
            >
              Privacy
            </Link>
            <Link
              href="/login"
              className="block bg-white text-blue-700 px-4 py-2 rounded-lg text-center hover:bg-blue-50 transition"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block bg-green-500 text-white px-4 py-2 rounded-lg text-center hover:bg-green-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </nav>

      <main className="min-h-screen bg-gray-50">{children}</main>

      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Application Gate – University
            Admission Assistant
          </p>
          <p className="text-sm mt-2">
            <Link href="/about" className="hover:text-white">
              About
            </Link>{" "}
            |
            <Link href="/privacy" className="hover:text-white ml-2">
              Privacy Policy
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}