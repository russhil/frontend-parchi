"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, CalendarPlus, Mic, Search } from "lucide-react";

const actions = [
  { label: "New Patient", icon: UserPlus, href: "/patients/new" },
  { label: "New Appointment", icon: CalendarPlus, href: "/schedule/new" },
  { label: "Voice Chat", icon: Mic, href: "#voice" },
  { label: "Search", icon: Search, href: "#search" },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => {
                  if (action.href === "#search") {
                    document.dispatchEvent(
                      new KeyboardEvent("keydown", { key: "k", metaKey: true })
                    );
                  } else if (action.href !== "#voice") {
                    router.push(action.href);
                  }
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{action.label}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
