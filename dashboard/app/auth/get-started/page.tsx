"use client";

import { motion } from "framer-motion";
import { Building2, Users, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function GetStartedPage() {
	const { user } = useAuth();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-4xl"
			>
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
						Welcome to SMS! 🎓
					</h1>
					<p className="text-gray-400 text-lg">
						{user?.name ? `Hello, ${user.name}!` : "Hello!"} Choose how you want
						to get started.
					</p>
				</div>

				{/* Options */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Option 1: Register School */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Card className="h-full bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
							<CardHeader className="text-center pb-2">
								<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
									<Building2 className="h-8 w-8 text-white" />
								</div>
								<CardTitle className="text-xl text-white">
									Register a School
								</CardTitle>
								<CardDescription className="text-gray-400">
									I want to create and manage my own school
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-4">
								<ul className="space-y-2 text-sm text-gray-400 mb-6">
									<li className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
										Submit your school for registration
									</li>
									<li className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
										Wait for admin approval
									</li>
									<li className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
										Full access to manage your school
									</li>
								</ul>
								<Link href="/auth/register-school">
									<Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
										Register School
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							</CardContent>
						</Card>
					</motion.div>

					{/* Option 2: Wait for Invitation */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<Card className="h-full bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
							<CardHeader className="text-center pb-2">
								<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
									<Users className="h-8 w-8 text-white" />
								</div>
								<CardTitle className="text-xl text-white">
									Wait for Invitation
								</CardTitle>
								<CardDescription className="text-gray-400">
									I'm a teacher, staff, or parent joining an existing school
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-4">
								<ul className="space-y-2 text-sm text-gray-400 mb-6">
									<li className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
										Your account is ready
									</li>
									<li className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
										Ask your school admin to add you
									</li>
									<li className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
										You'll get access once added
									</li>
								</ul>
								<div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
											<User className="h-5 w-5 text-purple-400" />
										</div>
										<div>
											<p className="text-sm font-medium text-white">
												{user?.email || "Your Email"}
											</p>
											<p className="text-xs text-gray-400">
												Share this with your school admin
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Footer note */}
				<p className="text-center text-gray-500 text-sm mt-8">
					Already have access?{" "}
					<Link href="/auth" className="text-blue-400 hover:underline">
						Go to Dashboard
					</Link>
				</p>
			</motion.div>
		</div>
	);
}
