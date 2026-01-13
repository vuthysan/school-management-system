"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClassPerformance } from "@/types/analytics";

interface ClassPerformanceChartProps {
	data: ClassPerformance[];
}

const COLORS = [
	"#8E2DE2", // Purple
	"#00B4DB", // Blue
	"#F2994A", // Orange
	"#11998e", // Teal
	"#FF5F6D", // Rose
	"#00d2ff", // Sky
];

export function ClassPerformanceChart({ data }: ClassPerformanceChartProps) {
	return (
		<Card className="border-none premium-shadow bg-white dark:bg-neutral-900 overflow-hidden">
			<CardHeader>
				<CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
					Average Performance by Class
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="#e5e7eb"
							/>
							<XAxis
								dataKey="className"
								angle={-45}
								textAnchor="end"
								interval={0}
								stroke="#6b7280"
								fontSize={10}
								fontWeight="bold"
							/>
							<YAxis
								stroke="#6b7280"
								fontSize={10}
								fontWeight="bold"
								domain={[0, 100]}
								tickFormatter={(value) => `${value}%`}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "rgba(255, 255, 255, 0.95)",
									borderRadius: "8px",
									border: "none",
									boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
								}}
								labelStyle={{ fontWeight: "bold", color: "#111827" }}
							/>
							<Bar
								dataKey="averageScore"
								name="Avg. Score (%)"
								radius={[20, 20, 0, 0]}
								barSize={32}
							>
								{data.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
