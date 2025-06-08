"use client";

import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google");
    } catch (error) {
      console.error("Error during sign in", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-100 to-gray-200 px-4">
      <Toaster position="top-center" />
      <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Account Manager
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Welcome back! Please sign in to continue.
        </p>
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="flex items-center justify-center w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogIn size={20} />
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}

export default Page;
