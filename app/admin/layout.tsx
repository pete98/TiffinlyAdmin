"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AuthProvider } from "@/contexts/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
          <div
            className={[
              "flex flex-1 flex-col transition-all duration-300",
              !isMobile && sidebarOpen ? "ml-64" : "",
              !isMobile && !sidebarOpen ? "ml-[70px]" : "",
            ].join(" ")}
          >
            <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
