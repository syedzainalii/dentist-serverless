"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function Navigation() {
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = window?.localStorage?.getItem("token");
    const userData = window?.localStorage?.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Error parsing user data:", err);
        window?.localStorage?.removeItem("token");
        window?.localStorage?.removeItem("user");
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    window?.localStorage?.removeItem("token");
    window?.localStorage?.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    router.push("/login");
  };

  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/verify-email");

  if (isAuthPage) return null;

  const isAdmin = user?.role === "admin" || user?.role === "moderator";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              B
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight">
                BrightSmile
              </span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Dental Clinic
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === "/" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/book"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === "/book" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              Book Appointment
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                {/* User Toggle Button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="group flex items-center space-x-3 rounded-xl border border-gray-200 bg-white p-1.5 pr-3 shadow-sm hover:shadow-md hover:border-blue-200 transition-all active:scale-95"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-xs font-bold text-white shadow-inner">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start text-left">
                    <span className="text-sm font-bold text-gray-900 leading-none mb-0.5">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
                      {user.role}
                    </span>
                  </div>
                  <svg 
                    className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180 text-blue-600' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="bg-gray-50/80 p-4 border-b border-gray-100">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-2">
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 text-purple-600">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                            </div>
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          href="/profile-setting"
                          className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span>Profile Settings</span>
                        </Link>

                        <div className="my-1 border-t border-gray-100" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100/50 text-red-600">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-white py-12">
              <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                      B
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 uppercase tracking-tight">
                        BrightSmile Dental
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Leading Excellence in Oral Healthcare
                      </p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-sm text-gray-500">
                      © {new Date().getFullYear()} BrightSmile Dental Clinic.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Designed for patient comfort and modern care.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}