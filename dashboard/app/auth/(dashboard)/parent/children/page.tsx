"use client";

import { motion } from "framer-motion";
import { Users, Calendar, FileText, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChildrenPage() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold">My Children</h1>
				<p className="text-muted-foreground">
					Monitor your children's academic progress.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="hover:border-primary transition-colors cursor-pointer">
					<CardHeader className="flex flex-row items-center gap-4">
						<Avatar className="h-16 w-16 border-2 border-primary/20">
							<AvatarImage src="" />
							<AvatarFallback>JD</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<CardTitle>John Doe</CardTitle>
							<p className="text-sm text-muted-foreground">
								Grade 10-A • Student ID: #12345
							</p>
						</div>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-4">
						<div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
							<p className="text-xs text-muted-foreground">Attendance</p>
							<p className="font-bold">96%</p>
						</div>
						<div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
							<p className="text-xs text-muted-foreground">Avg. Grade</p>
							<p className="font-bold text-green-500">A-</p>
						</div>
					</CardContent>
				</Card>

				<Card className="hover:border-primary transition-colors cursor-pointer">
					<CardHeader className="flex flex-row items-center gap-4">
						<Avatar className="h-16 w-16 border-2 border-primary/20">
							<AvatarImage src="" />
							<AvatarFallback>SD</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<CardTitle>Sarah Doe</CardTitle>
							<p className="text-sm text-muted-foreground">
								Grade 8-B • Student ID: #67890
							</p>
						</div>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-4">
						<div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
							<p className="text-xs text-muted-foreground">Attendance</p>
							<p className="font-bold">98%</p>
						</div>
						<div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
							<p className="text-xs text-muted-foreground">Avg. Grade</p>
							<p className="font-bold text-green-500">A+</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="bg-white dark:bg-neutral-800 rounded-xl p-8 border border-dashed border-gray-300 dark:border-neutral-700 flex flex-col items-center justify-center text-center">
				<Users className="h-12 w-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					Detailed Tracking Coming Soon
				</h3>
				<p className="text-gray-500 max-w-sm">
					We are working on bringing real-time assignment tracking and teacher
					communication directly to this dashboard.
				</p>
			</div>
		</div>
	);
}
