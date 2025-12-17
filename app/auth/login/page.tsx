"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

type LoginMode = "password" | "otp";
type OtpStep = "phone" | "verify";

interface FormErrors {
  email?: string;
  password?: string;
  phone?: string;
  otp?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, signInWithOtp, verifyOtp, user } = useAuth();
  
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("phone");
  
  // Password login state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  
  // OTP login state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (Indian format)
  const validatePhone = (phoneNum: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNum.replace(/\D/g, ""));
  };

  // Validate password form
  const validatePasswordForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await signInWithEmail(formData.email, formData.password);
      
      if (error) {
        setErrors({ general: error.message || "Invalid credentials. Please try again." });
      } else {
        router.push("/");
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrors({ general: error.message || "Failed to sign in with Google" });
      }
    } catch {
      setErrors({ general: "Failed to sign in with Google" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle phone submit for OTP
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || !validatePhone(cleanPhone)) {
      setErrors({ phone: "Please enter a valid 10-digit phone number" });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signInWithOtp(cleanPhone);
      
      if (error) {
        setErrors({ phone: error.message || "Failed to send OTP" });
      } else {
        setOtpStep("verify");
        setResendTimer(60);
      }
    } catch {
      setErrors({ phone: "Failed to send OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrors({ otp: "Please enter the complete 6-digit OTP" });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await verifyOtp(phone, otpValue);
      
      if (error) {
        setErrors({ otp: error.message || "Invalid OTP. Please try again." });
      } else {
        router.push("/");
      }
    } catch {
      setErrors({ otp: "Invalid OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const { error } = await signInWithOtp(phone);
      if (!error) {
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Switch login mode
  const switchToOtp = () => {
    setLoginMode("otp");
    setOtpStep("phone");
    setErrors({});
    setOtp(["", "", "", "", "", ""]);
  };

  const switchToPassword = () => {
    setLoginMode("password");
    setErrors({});
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
            <p className="text-gray-600 mt-2">
              {loginMode === "password" 
                ? "Welcome back! Please sign in to continue" 
                : otpStep === "phone" 
                  ? "Enter your phone number to receive OTP"
                  : `Enter OTP sent to +91 ${phone}`
              }
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Password Login Form */}
            {loginMode === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                      } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none`}
                      placeholder="Enter your email"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </span>
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
                      } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none pr-12`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-pink-600 hover:text-pink-700 font-medium cursor-pointer">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            )}

            {/* OTP Login - Phone Step */}
            {loginMode === "otp" && otpStep === "phone" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                        setErrors({});
                      }}
                      className={`w-full px-4 py-3 rounded-r-lg border ${
                        errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                      } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none`}
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phone.length !== 10}
                  className="w-full py-3.5 bg-linear-to-r from-pink-600 to-pink-500 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-pink-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>

                <button
                  type="button"
                  onClick={switchToPassword}
                  className="w-full text-center text-sm text-gray-500 hover:text-pink-600 cursor-pointer"
                >
                  ← Back to password login
                </button>
              </form>
            )}

            {/* OTP Login - Verify Step */}
            {loginMode === "otp" && otpStep === "verify" && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className={`w-12 h-14 text-center text-xl font-semibold rounded-lg border ${
                          errors.otp ? "border-red-300 bg-red-50" : "border-gray-300"
                        } focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none`}
                      />
                    ))}
                  </div>
                  {errors.otp && (
                    <p className="mt-2 text-sm text-red-500 text-center">{errors.otp}</p>
                  )}
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
                      Verifying...
                    </>
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-500">
                    Didn&apos;t receive OTP?{" "}
                    {resendTimer > 0 ? (
                      <span className="text-gray-400">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-pink-600 hover:text-pink-700 font-semibold cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOtpStep("phone")}
                    className="text-sm text-gray-500 hover:text-pink-600 cursor-pointer"
                  >
                    ← Change phone number
                  </button>
                </div>
              </form>
            )}

            {/* Divider - Only show for password mode */}
            {loginMode === "password" && (
              <>
                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-400">or continue with</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-70"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Continue with Google</span>
                  </button>
                </div>

                {/* OTP Login Button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={switchToOtp}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-pink-200 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors text-pink-600 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Login with OTP</span>
                  </button>
                </div>
              </>
            )}

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-pink-600 hover:text-pink-700 font-semibold cursor-pointer">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs">Secure Login</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-xs">100% Safe</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
