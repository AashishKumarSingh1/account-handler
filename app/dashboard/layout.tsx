import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export const metadata: Metadata = {
  title: "Account Handler",
  description: "Created By Aadarsh kumar singh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 h-screen overflow-auto">
            <Topbar />
            <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
          </div>
        </div>
  );
}