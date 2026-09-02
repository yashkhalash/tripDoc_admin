"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { Topbar } from "@/components/layout/topbar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageLoader } from "@/components/ui/page-loader";
import { tokenStore } from "@/lib/api-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!tokenStore.getAccessToken()) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return <PageLoader />;

  return (
    <div className="h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className={`flex h-screen flex-col transition-[padding] duration-200 ${collapsed ? "md:pl-20" : "md:pl-64"}`}>
        <Topbar onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
