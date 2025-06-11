"use client";

import { LogIn, Lock, ChevronRight, Loader2, ShieldCheck, Smartphone, Database} from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
function LoginPage() {
  const { status } = useSession();
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
      await signIn("google",{ callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Error during sign in", error);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      <Toaster position="top-center" />
      
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 flex items-center justify-center p-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <Database className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Account Manager</h1>
          <p className="text-xl text-blue-100 max-w-md">
            Streamline your inventory management with powerful analytics and real-time tracking
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {[ShieldCheck, Smartphone, Lock].map((Icon, i) => (
              <div key={i} className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <Icon className="h-6 w-6 text-white mx-auto" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400">Sign in to access your dashboard</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 dark:bg-gray-800 rounded-xl text-white font-medium shadow-lg hover:shadow-gray-900/20 transition-all duration-300 disabled:opacity-70 mb-6 cursor-pointer"
          >
            <span className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <div className="bg-white/20 p-1.5 rounded-lg cursor-pointer">
                    <LogIn className="h-4 w-4" />
                  </div>
                  <span>Continue with Google</span>
                </>
              )}
            </span>
            <ChevronRight className="h-5 w-5" />
          </motion.button>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Don&#39;t have access? Contact administrator</p>
            <div className="flex gap-4 justify-center items-center">
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
              Go To Home
            </Link>
            <Link href="/api/auth/error" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
              Request access
            </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;