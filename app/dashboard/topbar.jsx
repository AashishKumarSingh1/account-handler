"use client"
import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import useCurrentDate from "../../lib/current.time"
import { Clock, CalendarDays, User } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const SignOutModal = ({ show, onClose, handleSignOut }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Sign Out</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={()=>signOut()}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};


function Topbar() {
  const { data: session, status } = useSession();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const currentDate = useCurrentDate();

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (status === 'loading') {
    return (
      <div className="sticky top-0 z-[200] bg-white shadow-sm p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="animate-pulse h-6 w-40 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-4">
            <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-[200] bg-white shadow-sm p-4 border-b">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <h1 className="text-lg font-medium text-gray-800">
            Welcome, <span className="font-semibold">{session?.user?.name || 'User'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formattedTime}</span>
          </div>
          <SignOutModal show ={showSignOutModal} onClose={() => setShowSignOutModal(false)} />

          <div className="relative">
            {session?.user?.image ? (
              <Image
                src={session?.user?.image}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full cursor-pointer "
                // onClick={handleSignOut}
                onClick={() => setShowSignOutModal(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;