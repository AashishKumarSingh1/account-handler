"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Mail, Linkedin, Github, ArrowLeft, ShieldAlert, Lock, UserX } from "lucide-react";
import { motion } from "framer-motion";

function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900">
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 flex items-center justify-center p-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Access Restricted</h1>
          <p className="text-xl text-red-100 max-w-md">
            You don&#39;t have permission to access this application
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {[ShieldAlert, Lock, UserX].map((Icon, i) => (
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Access Denied</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please contact the administrator for access to this application
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-medium text-gray-800 dark:text-white">Contact Options:</h3>
            
            <motion.a 
              whileHover={{ x: 5 }}
              href="mailto:aashishs.ug23.cs@nitp.ac.in" 
              className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Mail className="h-5 w-5" />
              aashishs.ug23.cs@nitp.ac.in
            </motion.a>
            
            <motion.a 
              whileHover={{ x: 5 }}
              href="https://www.linkedin.com/in/aashish-kumar-singh-7110b02a9/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Linkedin className="h-5 w-5" />
              linkedin.com/in/aashish-kumar-singh-7110b02a9
            </motion.a>
            
            <motion.a 
              whileHover={{ x: 5 }}
              href="https://github.com/AashishKumarSingh1" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Github className="h-5 w-5" />
              github.com/AashishKumarSingh1
            </motion.a>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ErrorPage;