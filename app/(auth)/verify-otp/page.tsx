"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleSendPasswordResetOTP, handleVerifyOTP } from "@/lib/actions/talent-action";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const userType = (searchParams.get("usertype") || "candidate") as "candidate" | "employer";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(24);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyClick = async () => {
    if (!email) {
      setMessage("Missing email in the reset link.");
      setMessageType("error");
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setMessage("Enter complete 6-digit OTP");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Call the backend to verify OTP
      const response = await handleVerifyOTP(email, otpValue, userType);
      
      if (response.success) {
        setMessage("OTP verified successfully! Proceeding to reset password...");
        setMessageType("success");
        
        // Navigate to reset-password page after successful verification
        setTimeout(() => {
          router.push(
            `/reset-password?email=${encodeURIComponent(email)}&usertype=${userType}`
          );
        }, 1500);
      } else {
        setMessage(response.message || "Failed to verify OTP");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to verify OTP");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer !== 0) return;
    if (!email) {
      setMessage("Missing email in the reset link.");
      setMessageType("error");
      return;
    }

    setTimer(24);
    setOtp(["", "", "", "", "", ""]);
    try {
      const response = await handleSendPasswordResetOTP(email, userType);
      
      if (response && response.success) {
        setMessage("OTP resent! Check your email.");
        setMessageType("success");
      } else {
        setMessage(response?.message || "Failed to resend OTP.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to resend OTP.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans flex flex-col overflow-x-hidden">
      <main className="flex-1 flex items-center justify-center p-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/40 px-4 sm:px-6 py-3 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">Secure Verification</span>
          </div>

          <div className="px-6 sm:px-8 pt-8 pb-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="text-gray-900 dark:text-white text-xl sm:text-2xl font-bold mb-2">Verify Your Account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 max-w-[320px] px-2">
              We've sent a 6-digit code to <strong className="text-gray-800 dark:text-gray-200">{email || "your email"}</strong>. Enter it below to confirm your identity.
            </p>

            <div className="w-full mb-8">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-lg font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all caret-blue-500"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleVerifyClick}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 transform active:scale-[0.98] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mb-6 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Continue"}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {message && (
              <div className={`w-full text-center text-sm rounded-lg p-3 mb-4 ${
                messageType === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              }`}>
                {message}
              </div>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive code?{" "}
              <button
                onClick={handleResend}
                disabled={timer !== 0}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {timer !== 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
