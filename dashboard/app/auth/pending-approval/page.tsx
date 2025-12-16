"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Building2, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useDashboard } from "@/hooks/useDashboard";
import { useRouter } from "next/navigation";

export default function PendingApprovalPage() {
	const { user, logout } = useAuth();
	const { memberships, refetch, hasApprovedSchool, currentSchool } =
		useDashboard();
	const router = useRouter();
	const [checking, setChecking] = useState(false);

	// Check if user now has an APPROVED school - only then redirect to dashboard
	useEffect(() => {
		if (hasApprovedSchool) {
			// User has an approved school, redirect to dashboard
			router.push("/auth");
		}
	}, [hasApprovedSchool, router]);

	const handleCheckStatus = async () => {
		setChecking(true);
		await refetch();
		setTimeout(() => setChecking(false), 1000);
	};

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<Card className="bg-slate-800/50 border-slate-700">
					<CardContent className="pt-8 pb-6 text-center">
						{/* Animated clock icon */}
						<motion.div
							animate={{
								rotate: [0, 10, -10, 0],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatType: "reverse",
							}}
							className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center"
						>
							<Clock className="h-10 w-10 text-amber-500" />
						</motion.div>

						<h1 className="text-2xl font-bold text-white mb-2">
							Pending Approval
						</h1>
						<p className="text-gray-400 mb-6">
							Your school registration is being reviewed by our administrators.
							This usually takes 1-2 business days.
						</p>

						{/* School info card */}
						<div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 mb-6">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
									<Building2 className="h-5 w-5 text-blue-400" />
								</div>
								<div className="text-left">
									<p className="text-sm font-medium text-white">
										{currentSchool?.name?.en ||
											currentSchool?.displayName ||
											"Your School"}
									</p>
									<p className="text-xs text-gray-400">
										Status:{" "}
										<span className="text-amber-400">Pending Review</span>
									</p>
								</div>
							</div>
						</div>

						{/* What happens next */}
						<div className="text-left mb-6">
							<h3 className="text-sm font-medium text-gray-300 mb-3">
								What happens next?
							</h3>
							<ul className="space-y-2 text-sm text-gray-400">
								<li className="flex items-start gap-2">
									<span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mt-0.5">
										1
									</span>
									<span>Our team reviews your school details</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mt-0.5">
										2
									</span>
									<span>You'll receive an email notification</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs mt-0.5">
										3
									</span>
									<span>Once approved, you can access your dashboard</span>
								</li>
							</ul>
						</div>

						{/* Actions */}
						<div className="space-y-3">
							<Button
								onClick={handleCheckStatus}
								disabled={checking}
								variant="outline"
								className="w-full border-slate-600 hover:bg-slate-700"
							>
								{checking ? (
									<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<RefreshCw className="mr-2 h-4 w-4" />
								)}
								Check Status
							</Button>
							<Button
								onClick={handleLogout}
								variant="ghost"
								className="w-full text-gray-400 hover:text-white hover:bg-slate-700"
							>
								<LogOut className="mr-2 h-4 w-4" />
								Logout
							</Button>
						</div>

						<p className="text-xs text-gray-500 mt-6">
							Need help? Contact us at{" "}
							<a
								href="mailto:support@weteka.com"
								className="text-blue-400 hover:underline"
							>
								support@weteka.com
							</a>
						</p>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
