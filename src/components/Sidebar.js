"use client";

import React, { useState } from "react";
import Link from "next/link";
import { APP_ROLES } from "@/constants";
import { usePathname } from "next/navigation";
import {
  User,
  LayoutDashboard,
  FileUser,
  Banknote,
  FileQuestion,
  CheckSquare,
  FileUp,
  XSquare,
  Users,
  Download,
  UserPlus,
  Sliders,
  ThumbsUp,
  AlertCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
} from "lucide-react";

const menuConfig = {
  CREDIT: [
    { href: "/about", label: "MSME APPLICATION", icon: FileUser },
    { href: "/dashboard", label: "FT CASH APPLICATIONS", icon: LayoutDashboard },
    { href: "/disbursed", label: "DISBURSED", icon: Banknote },
    { href: "/pending", label: "PENDING", icon: FileQuestion },
    { href: "/approve", label: "APPROVED", icon: CheckSquare },
    { href: "/one-pager", label: "ONE PAGER", icon: FileUp },
    { href: "/rejected-pre", label: "REJECTED", icon: XSquare },
    { href: "/msme-lead", label: "MSME LEAD", icon: Users },
    { href: "/fi-report", label: "FI REPORT", icon: Download },
    { href: "/add-employee", label: "ADD EMPLOYEE", icon: UserPlus },
    { href: "/employee-access", label: "EMPLOYEE MANAGEMENT", icon: Sliders },
    { href: "/ao-approved", label: "AO Approved", icon: ThumbsUp },
    { href: "/ao-exception", label: "AO Exception", icon: AlertCircle },
    { href: "/voter-id-pending", label: "VOTER ID PENDING", icon: UserCheck },
    { href: "/voter-id-approved", label: "VOTER ID APPROVED", icon: UserCheck },
    { href: "/voter-id-rejected", label: "VOTER ID REJECTED", icon: UserX },
  ],
  AUDIT: [
    { href: "/about", label: "MSME APPLICATION", icon: FileUser },
    { href: "/disbursed", label: "DISBURSED", icon: Banknote },
    { href: "/pending", label: "PENDING", icon: FileQuestion },
    { href: "/approve", label: "APPROVED", icon: CheckSquare },
    { href: "/rejected-pre", label: "REJECTED", icon: XSquare },
    { href: "/fi-report", label: "FI REPORT", icon: Download },
    { href: "/voter-id-pending", label: "VOTER ID PENDING", icon: UserCheck },
    { href: "/voter-id-approved", label: "VOTER ID APPROVED", icon: UserCheck },
    { href: "/voter-id-rejected", label: "VOTER ID REJECTED", icon: UserX },
  ],
  USERACCESS: [
    { href: "/add-employee", label: "ADD EMPLOYEE", icon: UserPlus },
    { href: "/employee-access", label: "EMPLOYEE MANAGEMENT", icon: Sliders },
  ],
};

export default function Sidebar({ userId, userRole, collapsed, setCollapsed }) {
  const pathname = usePathname();

  const menuItems = userRole === APP_ROLES.ADMIN ? menuConfig.CREDIT : (menuConfig[userRole] || []);

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 bg-linear-to-b from-brand-blue via-[#123150] to-brand-blue border-r border-[#1E3A5F] text-white flex flex-col z-30 transition-all duration-300 shadow-xl ${
        collapsed ? "w-20" : "w-64"
      }`}
    >


      {/* Navigation Menu */}
      <nav id="sidebar-navigation" className="flex-1 overflow-y-auto py-2 px-3">
        <ul role="list" className="flex flex-col gap-0.5 m-0 p-0 list-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const idString = `sidebar-nav-${item.href.replace('/', '')}`;
            
            return (
              <li key={item.href}>
                <Link
                  id={idString}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? "bg-brand-orange text-white font-medium shadow-md shadow-brand-orange/20"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={16}
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "text-white" : "text-white/70 group-hover:text-white"
                    }`}
                  />
                  {!collapsed && (
                    <span className="text-[13px] truncate tracking-wide">{item.label}</span>
                  )}

                  {/* Tooltip on Hover when Collapsed */}
                  {collapsed && (
                    <div className="absolute left-24 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-gray-900 text-white text-xs rounded px-2 py-1.5 font-medium whitespace-nowrap shadow-md pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Version Footer */}
      {/* <div className="p-3 mt-auto border-t border-white/5 flex items-center justify-center">
        {!collapsed ? (
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
            v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}
          </span>
        ) : (
          <span className="text-[9px] text-white/40 font-semibold" title={`v${process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}`}>
            v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}
          </span>
        )}
      </div> */}
    </aside>
  );
}
