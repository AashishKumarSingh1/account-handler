"use client"
import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calculator,
  // Users,
  Factory,
  Package,
  FileText,
  // LogOut,
} from "lucide-react";
import { useState } from "react";
// import { signOut } from "next-auth/react";

const sidebarItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Profit Calculator", path: "/profit_calc", icon: Calculator },
  // { name: "Associated Party", path: "/associated_party", icon: Users },
  { name: "Stock Management", path: "/stock_manager", icon: Factory },
  { name: "Dispatching", path: "/dispatcher", icon: Package },
  // { name: "Extra Maal", path: "/extra_residual_maal", icon: Package },
  { name: "Detailed Report", path: "/report", icon: FileText },
  // {name:"Sign-Out",path:"/",icon:LogOut}
];
function Sidebar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <aside
      className={`bg-white shadow-md transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        {!sidebarCollapsed && (
          <>
          <h1 className="text-xl font-semibold text-gray-800">
            Account Handler
          </h1>

          {/* <button className={`flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  sidebarCollapsed ? "justify-center" : ""
                }`} onClick={()=>signOut()}>
            <LogOut /> Log-Out
          </button> */}
          </>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19 7-7-7-7" />
              <path d="M5 12h14" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 5-7 7 7 7" />
              <path d="M19 12H5" />
            </svg>
          )}
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.name}>
              <Link
                href={`/dashboard${item.path}`}
                className={`flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                  sidebarCollapsed ? "justify-center" : ""
                }`}
              >
                <item.icon className="w-5 h-5 text-gray-600" />
                {!sidebarCollapsed && (
                  <span className="ml-3 text-gray-700">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
