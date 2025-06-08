"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          You are not authorized to access this application.
        </p>

        <Link
          href="/"
          className="mt-2 w-full py-3 px-4 bg-gradient-to-tl from-red-600 via-red-500 to-red-400 text-white font-semibold rounded-full shadow-lg transition duration-300 hover:scale-105 flex items-center justify-center gap-2"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default Page;
