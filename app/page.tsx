"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  BarChart2,
  Package,
  Users,
  Database,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ====== FEATURES DATA ======
const features = [
  {
    name: "Real-time Inventory Tracking",
    description:
      "Monitor stock levels, weights, and quantities in real-time across all partners.",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    name: "Partner Management",
    description:
      "Easily manage all your business partners and their transactions in one place.",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    name: "Comprehensive Analytics",
    description:
      "Detailed charts and reports to understand your business performance.",
    icon: BarChart2,
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    name: "Transaction History",
    description:
      "Complete record of all buy/sell transactions with filtering capabilities.",
    icon: Database,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
  },
  {
    name: "Weight & Quantity Control",
    description:
      "Track both quantity and weight metrics for complete inventory control.",
    icon: Scale,
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
  {
    name: "Data Security",
    description: "Enterprise-grade security to protect your business data.",
    icon: ShieldCheck,
    color: "text-indigo-500",
    bgColor: "bg-indigo-100",
  },
];

// ====== TESTIMONIALS DATA ======
const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Commodity Trader",
    quote:
      "This system has transformed how we manage our inventory. The real-time tracking saves us hours every week.",
    avatar: "RK",
  },
  {
    name: "Priya Sharma",
    role: "Warehouse Manager",
    quote:
      "The partner distribution charts help us identify our most valuable relationships at a glance.",
    avatar: "PS",
  },
  {
    name: "Amit Patel",
    role: "Business Owner",
    quote:
      "Finally, a system that understands the unique needs of our commodity trading business.",
    avatar: "AP",
  },
];

// ====== STATS DATA ======
const stats = [
  { id: 1, name: "Partners Managed", value: 1200, icon: Users },
  { id: 2, name: "Stock Items Tracked", value: 850000, icon: Package },
  { id: 3, name: "Transactions Processed", value: 2400000, icon: Database },
  { id: 4, name: "Total Weight Managed (kg)", value: 12500000, icon: Scale },
];

export default function LandingPage() {
  // const [darkMode, setDarkMode] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  //   document.documentElement.classList.toggle("dark");
  // };

  return (
    <div
      className={`min-h-screen`}
    >
      {/* ===== NAVBAR ===== */}
      <nav className="fixed w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  Account
                  <span className="text-blue-600 dark:text-blue-400">
                    Manager
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button> */}
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <div className="relative pt-24 pb-16 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 overflow-hidden">
          <div className="absolute inset-0 opacity-20 dark:opacity-30 bg-[url('/grid.svg')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
              >
                <span className="block">Smart Inventory</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-blue-400">
                  Management
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-3 max-w-md mx-auto lg:mx-0 text-lg text-blue-100 dark:text-blue-200"
              >
                Streamline your commodity trading operations with real-time
                tracking, partner management, and powerful analytics.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 transition-colors"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="relative w-full h-80 sm:h-96 lg:h-[28rem] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold text-lg">
                      Monthly Transactions
                    </h3>
                    <div className="flex space-x-2">
                      <span className="text-xs text-white flex items-center">
                        <span className="w-2 h-2 bg-blue-300 rounded-full mr-1"></span>{" "}
                        Buy
                      </span>
                      <span className="text-xs text-white flex items-center">
                        <span className="w-2 h-2 bg-green-300 rounded-full mr-1"></span>{" "}
                        Sell
                      </span>
                    </div>
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute inset-0 flex items-end space-x-1 px-2">
                      {[3, 5, 7, 6, 4, 8].map((height, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={{ height: `${height * 10}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className={`flex-1 rounded-t-sm ${
                            index % 2 === 0 ? "bg-blue-400" : "bg-green-400"
                          }`}
                        ></motion.div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                        (month, index) => (
                          <span
                            key={index}
                            className="text-xs text-white opacity-70"
                          >
                            {month}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <div id="features" className="py-16 sm:py-24 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-base font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400">
              Features
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Powerful tools for your business
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              Everything you need to manage inventory, partners, and
              transactions efficiently.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-6">
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-md ${feature.bgColor} ${feature.color}`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== STATS SECTION ===== */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 text-center"
              >
                <div className="flex items-center justify-center h-12 w-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  <Counter from={0} to={stat.value} />+
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <div className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-base font-semibold tracking-wide uppercase text-blue-600 dark:text-blue-400">
              Testimonials
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Trusted by businesses worldwide
            </p>
          </motion.div>

          <div className="mt-12 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-3xl mx-auto"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-300 italic">
                  &quot;{testimonials[currentTestimonial].quote}&quot;
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 w-2 rounded-full ${
                    currentTestimonial === index
                      ? "bg-blue-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== CTA SECTION ===== */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            <span className="block">
              Ready to transform your inventory management?
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-4 max-w-2xl text-xl text-blue-100 dark:text-blue-200 mx-auto"
          >
            Get started with Account Manager today and take control of your
            commodity trading operations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 transition-colors"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Designed & Developed by{" "}
          <Link className="font-semibold hover:ext-gray- hover:text-white text-blue-600 hover:underline " href={"https://www.linkedin.com/in/aashish-kumar-singh-7110b02a9/"}>
            Aashish Singh
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ===== ANIMATED COUNTER COMPONENT =====
function Counter({ from, to }: { from: number; to: number }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const duration = 2000;
    const increment = Math.max(Math.floor(to / (duration / 16)), 1);
    let start = from;

    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [from, to]);

  return <span>{count.toLocaleString()}</span>;
}
