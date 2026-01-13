"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubjectPerformance } from "@/types/analytics";

interface SubjectPerformanceChartProps {
	data: SubjectPerformance[];
}

export function SubjectPerformanceChart({
	data,
}: SubjectPerformanceChartProps) {
	return (
		<Card className="border-none premium-shadow bg-white dark:bg-neutral-900 overflow-hidden">
			<CardHeader>
				<CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
					Average Grade by Subject
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							layout="vertical"
							data={data}
							margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								horizontal={true}
								vertical={false}
								stroke="#e5e7eb"
							/>
							<XAxis
								type="number"
								domain={[0, 100]}
								stroke="#6b7280"
								fontSize={10}
								fontWeight="bold"
								tickFormatter={(value) => `${value}%`}
							/>
							<YAxis
								dataKey="subjectName"
								type="category"
								stroke="#6b7280"
								fontSize={10}
								fontWeight="bold"
								width={80}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: "8px",
									border: "none",
									boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
								}}
							/>
							<Bar
								dataKey="averageScore"
								fill="#00B4DB"
								name="Avg. Score (%)"
								radius={[0, 10, 10, 0]}
								barSize={16}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
