"use client";

import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { MembershipGuard } from "@/components/membership-guard";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<MembershipGuard>
			<SidebarProvider>
				<div className="relative flex h-screen overflow-hidden liquid-glass-bg text-foreground font-sans">
					<div className="relative z-20">
						<Sidebar />
					</div>

					<div className="relative z-10 flex-1 flex flex-col overflow-hidden">
						<Navbar />
						<main className="relative z-1 flex-1 overflow-y-auto overflow-x-hidden">
							<div className="p-6 md:p-8 lg:p-10 max-w-400 mx-auto w-full">
								{children}
							</div>
						</main>
					</div>
				</div>
			</SidebarProvider>
		</MembershipGuard>
	);
}
