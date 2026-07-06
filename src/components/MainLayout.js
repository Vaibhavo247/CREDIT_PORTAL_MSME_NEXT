"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children, userId, userRole }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-white pt-16 w-full overflow-hidden">
      <Navbar employeeId={userId} role={userRole} collapsed={collapsed} />
      
      {/* Collapsible Sidebar */}
      <Sidebar
        userId={userId}
        userRole={userRole}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Layout Container */}
      <div className={`flex-1 flex flex-col transition-all duration-300 min-w-0 overflow-x-hidden ${
        collapsed ? "pl-20" : "pl-20 md:pl-64"
      }`}>


        {/* Content Body */}
        <main id="main-content" className="flex-1 p-6 md:p-10 animate-fade-in text-[13px] text-gray-700 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
