"use client";

import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceTrend } from "@/types/analytics";
import { format, parseISO } from "date-fns";

interface AttendanceTrendChartProps {
	data: AttendanceTrend[];
}

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
	return (
		<Card className="border-none premium-shadow bg-white dark:bg-neutral-900 overflow-hidden">
			<CardHeader>
				<CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
					Attendance Trends
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={data}
							margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#00B4DB" stopOpacity={0.4} />
									<stop offset="95%" stopColor="#00B4DB" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="#e5e7eb"
							/>
							<XAxis
								dataKey="date"
								stroke="#6b7280"
								fontSize={10}
								fontWeight="bold"
								tickFormatter={(str) => {
									try {
										return format(parseISO(str), "MMM d");
									} catch (e) {
										return str;
									}
								}}
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
									borderRadius: "12px",
									border: "none",
									boxShadow:
										"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
									backgroundColor: "rgba(255, 255, 255, 0.95)",
								}}
								labelStyle={{ fontWeight: "bold", color: "#111827" }}
								labelFormatter={(label) => {
									try {
										return format(parseISO(label), "EEEE, MMMM do");
									} catch (e) {
										return label;
									}
								}}
							/>
							<Area
								type="monotone"
								dataKey="attendanceRate"
								stroke="#00B4DB"
								strokeWidth={4}
								fillOpacity={1}
								fill="url(#colorRate)"
								name="Attendance Rate"
								dot={{ fill: "#00B4DB", strokeWidth: 2, r: 4, fillOpacity: 1 }}
								activeDot={{ r: 6, strokeWidth: 0 }}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
