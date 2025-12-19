"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentAcademicPage() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold">Academic Overview</h1>
				<p className="text-muted-foreground">
					Manage your studies and schedule.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">My Schedule</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">Today: 4 Classes</div>
						<p className="text-xs text-muted-foreground">
							Next: Mathematics at 10:00 AM
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">My Grades</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">Avg: 3.8 GPA</div>
						<p className="text-xs text-muted-foreground">
							Last update: 2 days ago
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Attendance</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">95.5%</div>
						<p className="text-xs text-muted-foreground">
							Present for 180/188 days
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="bg-white dark:bg-neutral-800 rounded-xl p-8 border border-dashed border-gray-300 dark:border-neutral-700 flex flex-col items-center justify-center text-center">
				<BookOpen className="h-12 w-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					Full Academic View Coming Soon
				</h3>
				<p className="text-gray-500 max-w-sm">
					We are currently integrating your detailed schedule and grade reports
					into this unified view.
				</p>
			</div>
		</div>
	);
}
