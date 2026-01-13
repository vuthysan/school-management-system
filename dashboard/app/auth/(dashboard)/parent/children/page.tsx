"use client";

import { motion } from "framer-motion";
import { Users, Loader2, AlertCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useParentChildren, ChildInfo } from "@/hooks/useParentChildren";
import Link from "next/link";

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function ChildCard({ child }: { child: ChildInfo }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ scale: 1.02 }}
		>
			<Card className="hover:border-primary transition-colors cursor-pointer h-full">
				<CardHeader className="flex flex-row items-center gap-4">
					<Avatar className="h-16 w-16 border-2 border-primary/20">
						<AvatarImage src="" />
						<AvatarFallback>{getInitials(child.fullName)}</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<CardTitle>{child.fullName}</CardTitle>
						<p className="text-sm text-muted-foreground">
							{child.currentClass?.name || child.gradeLevel} • ID: #
							{child.studentId}
						</p>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
							<p className="text-xs text-muted-foreground">Attendance</p>
							<p className="font-bold">
								{child.attendanceRate !== undefined
									? `${child.attendanceRate}%`
									: "N/A"}
							</p>
						</div>
						<div className="p-3 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
							<p className="text-xs text-muted-foreground">Avg. Grade</p>
							<p className="font-bold text-green-500">
								{child.averageGrade || "N/A"}
							</p>
						</div>
					</div>
					<Link href={`/auth/parent/children/${child.id}`}>
						<Button variant="outline" className="w-full gap-2">
							<Eye className="h-4 w-4" />
							View Details
						</Button>
					</Link>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export default function ChildrenPage() {
	const { children, isLoading, error, refresh } = useParentChildren();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-64 gap-4">
				<AlertCircle className="h-12 w-12 text-destructive" />
				<p className="text-destructive">{error}</p>
				<Button variant="outline" onClick={refresh}>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold">My Children</h1>
				<p className="text-muted-foreground">
					Monitor your children's academic progress.
				</p>
			</div>

			{children.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{children.map((child) => (
						<ChildCard key={child.id} child={child} />
					))}
				</div>
			) : (
				<div className="bg-white dark:bg-neutral-800 rounded-xl p-8 border border-dashed border-gray-300 dark:border-neutral-700 flex flex-col items-center justify-center text-center">
					<Users className="h-12 w-12 text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						No Children Linked
					</h3>
					<p className="text-gray-500 max-w-sm">
						No children are currently linked to your account. Please contact
						your school administration to link your children.
					</p>
				</div>
			)}
		</div>
	);
}
