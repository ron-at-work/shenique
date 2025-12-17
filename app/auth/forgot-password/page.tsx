"use client";

import React, { useState } from "react";
import Link from "next/link";

type Step = "email" | "success";

export default function ForgotPasswordPage() {
  // Auth functionality removed - Supabase has been removed from the project
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Auth functionality removed - Supabase has been removed from the project
      setError("Password reset is currently unavailable. Please contact support.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-pink-50 via-white to-purple-50">
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-(family-name:--font-dancing) font-semibold bg-linear-to-r from-pink-600 via-pink-500 to-pink-600 bg-clip-text text-transparent">
                Shenique
              </h1>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {step === "email" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Forgot Password?</h2>
                  <p className="text-gray-600 mt-2">
                    No worries! Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        error ? "border-red-300 bg-red-50" : "border-gray-300"
                      } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none`}
                      placeholder="Enter your email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-linear-to-r from-pink-600 to-pink-500 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-pink-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            )}

            {step === "success" && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check your email!</h2>
                <p className="text-gray-600 mb-6">
                  We&apos;ve sent a password reset link to<br />
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Click the link in the email to reset your password.
                  The link will expire in 1 hour.
                </p>
                <button
                  onClick={() => {
                    setStep("email");
                    setEmail("");
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium text-sm cursor-pointer"
                >
                  Didn&apos;t receive email? Try again
                </button>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
