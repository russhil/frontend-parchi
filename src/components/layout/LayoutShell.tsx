"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { cn } from "@/lib/utils";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();

  // No margin on login page (no sidebar)
  if (pathname === "/login") {
    return <div className="flex-1 flex flex-col min-w-0">{children}</div>;
  }

  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-200",
        collapsed ? "ml-16" : "ml-60"
      )}
    >
      {children}
    </div>
  );
}
