"use client";

import { motion } from "framer-motion";
import { Building, BarChart3, ShieldCheck, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MinistrySchoolsPage() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold">National School Oversight</h1>
				<p className="text-muted-foreground">
					Monitor and manage schools at the national level.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Total registered
						</CardTitle>
						<Building className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">1,234</div>
						<p className="text-xs text-green-500">+45 this month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Active Students
						</CardTitle>
						<BarChart3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">450K</div>
						<p className="text-xs text-muted-foreground">
							Across all provinces
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Compliance Rate
						</CardTitle>
						<ShieldCheck className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">92%</div>
						<p className="text-xs text-orange-500">8% pending review</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Provinces Covered
						</CardTitle>
						<MapPin className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">25/25</div>
						<p className="text-xs text-muted-foreground">
							Full national coverage
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="bg-white dark:bg-neutral-800 rounded-xl p-8 border border-dashed border-gray-300 dark:border-neutral-700 flex flex-col items-center justify-center text-center">
				<Building className="h-12 w-12 text-gray-400 mb-4" />
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					National Management Portal Coming Soon
				</h3>
				<p className="text-gray-500 max-w-sm">
					We are integrating school-level data aggregates and compliance
					reporting for Ministry-level oversight.
				</p>
			</div>
		</div>
	);
}
