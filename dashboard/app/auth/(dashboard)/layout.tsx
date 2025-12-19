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
          <div className="p-6 flex-1">{children}</div>
        </main>
      </div>
    </MembershipGuard>
  );
}
