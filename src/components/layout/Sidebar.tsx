"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: "home", label: "Home", href: "/" },
  { icon: "calendar_today", label: "Schedule", href: "/appointments" },
  { icon: "group", label: "Patients", href: "/patients" },
  { icon: "settings", label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] bg-surface border-r border-border-light flex flex-col items-center py-4 z-50">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white font-bold text-lg">
        C
      </Link>

      {/* Nav Items */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${isActive
                ? "bg-primary-light text-primary"
                : "text-text-secondary hover:bg-gray-100"
                }`}
              title={item.label}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Doctor Avatar */}
      <div className="mt-auto">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
          DP
        </div>
      </div>
    </aside>
  );
}
