"use client";

import { useState, useRef, useEffect } from "react";
import {
	Bell,
	Clock,
	Star,
	DollarSign,
	Megaphone,
	AlertCircle,
	CheckCheck,
	X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useNotifications, type NotificationItem } from "@/hooks/useNotifications";

const typeIcons: Record<string, typeof Clock> = {
	Absence: Clock,
	LateArrival: Clock,
	GradeUpdate: Star,
	Finance: DollarSign,
	Announcement: Megaphone,
	Other: AlertCircle,
};

const typeColors: Record<string, string> = {
	Absence: "text-red-500 bg-red-50 dark:bg-red-950/40",
	LateArrival: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
	GradeUpdate: "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
	Finance: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
	Announcement: "text-violet-500 bg-violet-50 dark:bg-violet-950/40",
	Other: "text-gray-500 bg-gray-50 dark:bg-gray-950/40",
};

function timeAgo(dateStr: string): string {
	const now = new Date();
	const date = new Date(dateStr);
	const diff = now.getTime() - date.getTime();
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return date.toLocaleDateString();
}

function NotificationItemRow({
	notification,
	onMarkRead,
}: {
	notification: NotificationItem;
	onMarkRead: (id: string) => void;
}) {
	const Icon = typeIcons[notification.notificationType] || typeIcons.Other;
	const colorClass =
		typeColors[notification.notificationType] || typeColors.Other;

	return (
		<button
			className={cn(
				"w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
				!notification.isRead && "bg-primary/3"
			)}
			onClick={() => {
				if (!notification.isRead) onMarkRead(notification.id);
			}}
		>
			<div
				className={cn(
					"w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
					colorClass
				)}
			>
				<Icon className="h-4 w-4" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<p
						className={cn(
							"text-sm truncate",
							notification.isRead
								? "text-foreground/70"
								: "text-foreground font-medium"
						)}
					>
						{notification.title}
					</p>
					{!notification.isRead && (
						<div className="w-2 h-2 rounded-full bg-primary shrink-0" />
					)}
				</div>
				<p className="text-xs text-muted-foreground truncate mt-0.5">
					{notification.message}
				</p>
				<p className="text-xs text-muted-foreground/60 mt-1">
					{timeAgo(notification.createdAt)}
				</p>
			</div>
		</button>
	);
}

export function NotificationBell() {
	const { t } = useTranslation();
	const { notifications, unreadCount, markAsRead, markAllAsRead } =
		useNotifications();
	const [isOpen, setIsOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);

	// Close panel on outside click
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		}
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	return (
		<div className="relative" ref={panelRef}>
			{/* Bell Button */}
			<button
				className={cn(
					"h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer relative",
					"text-muted-foreground/70 hover:text-foreground hover:bg-muted/50"
				)}
				title={t("notifications") || "Notifications"}
				onClick={() => setIsOpen(!isOpen)}
			>
				<Bell className="h-4 w-4" />
				{unreadCount > 0 && (
					<span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
						{unreadCount > 99 ? "99+" : unreadCount}
					</span>
				)}
			</button>

			{/* Dropdown Panel */}
			{isOpen && (
				<div className="absolute right-0 top-10 w-80 sm:w-96 rounded-xl border border-black/6 dark:border-white/6 bg-background shadow-lg z-50 overflow-hidden">
					{/* Header */}
					<div className="flex items-center justify-between px-4 py-3 border-b border-black/6 dark:border-white/6">
						<h3 className="text-sm font-semibold text-foreground">
							{t("notifications")}
						</h3>
						<div className="flex items-center gap-1">
							{unreadCount > 0 && (
								<button
									className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-muted/50 transition-colors"
									onClick={() => markAllAsRead()}
								>
									<CheckCheck className="h-3.5 w-3.5" />
									{t("mark_all_read")}
								</button>
							)}
							<button
								className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors"
								onClick={() => setIsOpen(false)}
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</div>

					{/* Notification List */}
					<div className="max-h-80 overflow-y-auto divide-y divide-black/4 dark:divide-white/4">
						{notifications.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center mb-2">
									<Bell className="h-4 w-4 text-muted-foreground" />
								</div>
								<p className="text-sm text-muted-foreground">
									{t("no_notifications")}
								</p>
							</div>
						) : (
							notifications.map((notification) => (
								<NotificationItemRow
									key={notification.id}
									notification={notification}
									onMarkRead={markAsRead}
								/>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}
