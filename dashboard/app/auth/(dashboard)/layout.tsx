import { Suspense } from "react";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { MembershipGuard } from "@/components/membership-guard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MembershipGuard>
      <div className="relative flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="sticky top-0 z-10 border-b border-divider flex items-center justify-between">
            <Suspense fallback={<div>Loading...</div>}>
              <Navbar />
            </Suspense>
          </div>
          <div className="p-6 flex-1">{children}</div>
        </main>
      </div>
    </MembershipGuard>
  );
}
