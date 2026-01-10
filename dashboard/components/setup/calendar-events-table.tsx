"use client";

import { useTranslation } from "react-i18next";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	MoreHorizontal,
	Edit,
	Trash,
	Calendar as CalendarIcon,
	MapPin,
	Info,
	AlertTriangle,
} from "lucide-react";
import { CalendarEvent, CalendarEventType } from "@/hooks/useCalendarEvents";

interface CalendarEventsTableProps {
	items: CalendarEvent[];
	isLoading: boolean;
	onEdit: (item: CalendarEvent) => void;
	onDelete: (item: CalendarEvent) => void;
}

export function CalendarEventsTable({
	items,
	isLoading,
	onEdit,
	onDelete,
}: CalendarEventsTableProps) {
	const { t } = useTranslation();

	const getEventTypeBadge = (type: CalendarEventType) => {
		switch (type) {
			case "Holiday":
				return (
					<Badge
						variant="default"
						className="bg-red-500/10 text-red-500 border-red-500/20"
					>
						{t("Holiday")}
					</Badge>
				);
			case "Break":
				return (
					<Badge
						variant="default"
						className="bg-orange-500/10 text-orange-500 border-orange-500/20"
					>
						{t("Break")}
					</Badge>
				);
			case "Exam":
				return (
					<Badge
						variant="default"
						className="bg-blue-500/10 text-blue-500 border-blue-500/20"
					>
						{t("Exam")}
					</Badge>
				);
			case "Event":
				return (
					<Badge
						variant="default"
						className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
					>
						{t("Event")}
					</Badge>
				);
			case "Meeting":
				return (
					<Badge
						variant="default"
						className="bg-purple-500/10 text-purple-500 border-purple-500/20"
					>
						{t("Meeting")}
					</Badge>
				);
			case "Deadline":
				return (
					<Badge
						variant="default"
						className="bg-amber-500/10 text-amber-500 border-amber-500/20"
					>
						{t("Deadline")}
					</Badge>
				);
			default:
				return <Badge variant="outline">{t(type)}</Badge>;
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 border rounded-xl bg-muted/10">
				<CalendarIcon className="h-8 w-8 animate-pulse text-muted-foreground" />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-xl bg-muted/5 gap-4">
				<CalendarIcon className="h-8 w-8 text-neutral-400" />
				<div className="text-center">
					<h3 className="font-semibold">{t("no_calendar_events")}</h3>
					<p className="text-sm text-neutral-500">
						{t("start_by_adding_event")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="border rounded-xl overflow-hidden bg-background shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/30">
						<TableHead className="font-bold">{t("title")}</TableHead>
						<TableHead className="font-bold">{t("type")}</TableHead>
						<TableHead className="font-bold">{t("dates")}</TableHead>
						<TableHead className="font-bold">{t("location")}</TableHead>
						<TableHead className="font-bold">{t("school_closed")}</TableHead>
						<TableHead className="text-right font-bold">
							{t("actions")}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<TableRow
							key={item.idStr}
							className="hover:bg-muted/10 transition-colors"
						>
							<TableCell className="font-medium">
								<div className="flex flex-col">
									<span>{item.title}</span>
									{item.description && (
										<span className="text-xs text-muted-foreground line-clamp-1">
											{item.description}
										</span>
									)}
								</div>
							</TableCell>
							<TableCell>{getEventTypeBadge(item.eventType)}</TableCell>
							<TableCell className="text-sm">
								<div className="flex flex-col">
									<span>
										{new Date(item.startDateStr).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</span>
									<span className="text-xs text-muted-foreground">
										{new Date(item.startDateStr).toLocaleTimeString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
										})}{" "}
										-{" "}
										{new Date(item.endDateStr).toLocaleTimeString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								{item.location ? (
									<div className="flex items-center gap-1">
										<MapPin className="h-3 w-3" />
										<span>{item.location}</span>
									</div>
								) : (
									"-"
								)}
							</TableCell>
							<TableCell>
								{item.isSchoolClosed ? (
									<Badge
										variant="outline"
										className="text-red-500 border-red-500/20 gap-1"
									>
										<AlertTriangle className="h-3 w-3" />
										{t("closed")}
									</Badge>
								) : (
									<span className="text-xs text-muted-foreground">
										{t("open")}
									</span>
								)}
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => onEdit(item)}>
											<Edit className="mr-2 h-4 w-4" /> {t("edit")}
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-destructive"
											onClick={() => onDelete(item)}
										>
											<Trash className="mr-2 h-4 w-4" /> {t("delete")}
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
