import { Sidebar } from "@/components/sidebar";
import { MembershipGuard } from "@/components/membership-guard";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<MembershipGuard>
			<div className="relative flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/20">
				{/* Cinematic Background Orbs */}
				<div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
					<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-float" />
					<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-float animation-delay-2000" />
					<div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] rounded-full bg-primary/10 blur-[80px] animate-pulse-slow" />
				</div>

				{/* Sidebar with higher z-index */}
				<div className="relative z-20">
					<Sidebar />
				</div>

				{/* Main Content */}
				<main className="relative z-10 flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
					<div className="flex-1 p-6 md:p-8 lg:p-10 max-w-[1800px] mx-auto w-full">
						{children}
					</div>
				</main>
			</div>
		</MembershipGuard>
	);
}
