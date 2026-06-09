"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function LoginContent() {
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const msg = searchParams.get("message");
    const err = searchParams.get("error");
    
    if (msg) {
      setErrorMsg(msg);
    }
    if (err === "session_expired") {
      toast.error("Your session has expired. Please log in again.");
    } else if (err) {
      toast.error(err);
    }
  }, [searchParams]);

  const handleLogin = () => {
    window.location.href = "https://msme.suryodayuat.bank.in/api/ibm/login";
  };

  const handleDevBypass = () => {
    document.cookie = "DEV_BYPASS=true; path=/";
    window.location.href = "/about";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-brand-blue via-brand-blue-hover to-[#04335c] text-white p-6">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-md p-8 md:p-10 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col items-center hover-scale select-none relative z-10">
        <div className="bg-white p-3 rounded-2xl shadow-inner mb-6">
          <img
            src="/image.png"
            className="h-16 w-auto object-contain"
            alt="Suryoday Bank Logo"
          />
        </div>

        <h1 className="text-2xl font-bold tracking-wide text-white mb-2 text-center">
          Suryoday Bank
        </h1>
        <p className="text-gray-400 text-sm mb-8 text-center max-w-xs leading-relaxed font-light">
          MSME &amp; FT-Cash Underwriting Management Portal
        </p>

        {errorMsg && (
          <div className="w-full p-4 mb-6 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center leading-normal">
            {errorMsg}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover active:bg-brand-orange text-white font-semibold rounded-2xl shadow-lg shadow-brand-orange/20 transition-all duration-200 text-sm cursor-pointer"
        >
          Sign In with SSO
        </button>

        {process.env.NODE_ENV === "development" && (
          <button
            onClick={handleDevBypass}
            className="w-full py-3.5 mt-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 text-sm cursor-pointer"
          >
            DEV BYPASS (Local Only)
          </button>
        )}

        <footer className="mt-8 text-[11px] text-white/40 text-center tracking-wide leading-normal">
          Authorized personnel only. Sessions are encrypted and audited.
          <br />
          Version {process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}
        </footer>
      </main>
    </div>
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-blue" />}>
      <LoginContent />
    </Suspense>
  );
}
