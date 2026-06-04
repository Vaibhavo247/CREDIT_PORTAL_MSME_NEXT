"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { logoutAction } from '@/app/actions';

export default function Navbar({ employeeId, role, avatarSrc, collapsed }) {
  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);

  const initials = (employeeId || role || 'U')
    .toString()
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <nav id="main-navbar" className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 z-50 h-16 flex items-center justify-between px-4 md:px-8">
      {/* Left Section: Logo + Text aligned with Sidebar */}
      <div className="flex items-center h-full">
        <div className={`flex items-center shrink-0 transition-all duration-300 ${collapsed ? "w-[48px]" : "w-[224px]"}`}>
           <img 
              src="/image.png"
              alt="Suryoday Bank"
              className="h-10 w-auto"
            />
        </div>
        
        {/* Plain Text, aligned slightly right of where the sidebar ends */}
        <div className="text-sm md:text-base flex flex-col font-bold text-brand-blue tracking-wide pointer-events-none ml-4 md:ml-8">
          <span className="hidden md:inline">SURYODAY BANK OF SMILES</span>
          <span className="sm:hidden text-brand-orange">SDB</span>
        </div>
      </div>

      {/* Right Section - User Profile & Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* User Profile & Menu */}
        <div className="relative">
          <button
            id="navbar-profile-btn"
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 md:gap-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Avatar"
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-bold text-brand-orange border border-brand-orange/20">
                {initials}
              </div>
            )}
            <div className="hidden sm:flex flex-col items-start pr-2">
              <p className="text-xs font-bold text-gray-800">{employeeId}</p>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{role}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/50">
                  <p className="text-sm font-semibold text-white">{employeeId}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{role}</p>
                </div>
                <button
                  id="navbar-logout-btn"
                  type="button"
                  onClick={handleLogout}
                  disabled={isPending}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  <span>🚪</span>
                  {isPending ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
