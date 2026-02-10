import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { UserProvider } from "@/components/providers/user-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { CommandPalette } from "@/components/command-palette";

export const metadata: Metadata = {
  title: "Parchi.ai — AI Medical Records",
  description: "AI-powered medical record system for small clinics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <TooltipProvider>
              <SidebarProvider>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <LayoutShell>
                    <Header />
                    <main className="flex-1 p-6 overflow-auto">
                      {children}
                    </main>
                  </LayoutShell>
                </div>
                <CommandPalette />
              </SidebarProvider>
            </TooltipProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
