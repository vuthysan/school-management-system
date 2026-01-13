"use client";

import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradeDistribution } from "@/types/analytics";

interface GradeDistributionChartProps {
	data: GradeDistribution[];
}

const COLORS = {
	A: "#11998e", // Green/Teal
	B: "#00B4DB", // Blue
	C: "#F2994A", // Orange
	D: "#F2C94C", // Yellow
	F: "#FF5F6D", // Rose/Red
};

const DEFAULT_COLOR = "#6b7280";

export function GradeDistributionChart({ data }: GradeDistributionChartProps) {
	// Sort data to ensure consistent order (A, B, C, D, F)
	const sortedData = [...data].sort((a, b) => a.grade.localeCompare(b.grade));

	return (
		<Card className="border-none premium-shadow bg-white dark:bg-neutral-900 overflow-hidden">
			<CardHeader>
				<CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
					Grade Distribution
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={sortedData}
								cx="50%"
								cy="50%"
								innerRadius={70}
								outerRadius={100}
								paddingAngle={8}
								dataKey="count"
								nameKey="grade"
							>
								{sortedData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={
											COLORS[entry.grade as keyof typeof COLORS] ||
											DEFAULT_COLOR
										}
									/>
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									borderRadius: "8px",
									border: "none",
									boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Legend verticalAlign="bottom" height={36} />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
