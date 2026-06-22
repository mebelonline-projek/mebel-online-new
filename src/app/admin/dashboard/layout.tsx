"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/dashboard/products": "Produk",
    "/admin/dashboard/categories": "Kategori",
    "/admin/dashboard/settings": "Pengaturan",
    "/admin/dashboard/profile": "Profil",
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div
          className={cn(
            "transition-all duration-300",
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          )}
        >
          <AdminHeader />

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold font-poppins text-foreground mb-6">
                {pageTitle}
              </h1>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}