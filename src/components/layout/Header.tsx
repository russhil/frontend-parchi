"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  patients: "Patients",
  appointments: "Schedule",
  schedule: "Schedule",
  settings: "Settings",
  patient: "Patient",
  appointment: "Appointment",
  consult: "Consult",
  login: "Login",
  add: "New",
  new: "New",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [{ label: "Dashboard", href: "/" }];

  const crumbs: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/" },
  ];

  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = routeLabels[seg] || seg;
    // Skip UUID-like segments in breadcrumb display
    if (seg.match(/^[0-9a-f-]{8,}$/i)) continue;
    crumbs.push({ label, href: path });
  }

  return crumbs;
}

export default function Header() {
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const breadcrumbs = getBreadcrumbs(pathname);

  // Don't render header on login page
  if (pathname === "/login") return null;

  return (
    <header className="h-14 bg-card/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-muted-foreground">/</span>
            )}
            <span
              className={cn(
                i === breadcrumbs.length - 1
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Search Trigger */}
      <Button
        variant="outline"
        className="h-9 w-64 justify-start text-muted-foreground font-normal gap-2"
        onClick={() => {
          // Will be wired to Command Palette in Phase 3
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
        }}
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </header>
  );
}
