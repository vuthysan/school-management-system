"use client";

import { useState } from "react";
import {
	Megaphone,
	Plus,
	Trash2,
	Calendar,
	Filter,
	Bell,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import {
	AnnouncementTargetType,
	AnnouncementPriority,
} from "@/types/communication";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/dashboard/loading-state";

export default function CommunicationPage() {
	const { t } = useLanguage();
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const {
		announcements,
		isLoading,
		createAnnouncement,
		deleteAnnouncement,
	} = useAnnouncements(schoolId);

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [newAnnouncement, setNewAnnouncement] = useState({
		title: "",
		content: "",
		targetType: AnnouncementTargetType.School,
		targetIds: [] as string[],
		priority: AnnouncementPriority.Normal,
	});

	const handleCreate = async () => {
		try {
			await createAnnouncement(newAnnouncement);
			setIsCreateModalOpen(false);
			setNewAnnouncement({
				title: "",
				content: "",
				targetType: AnnouncementTargetType.School,
				targetIds: [] as string[],
				priority: AnnouncementPriority.Normal,
			});
		} catch (err) {
			// Error handled in hook
		}
	};

	const filteredAnnouncements = announcements.filter(
		(a) =>
			a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			a.content.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const getPriorityBadge = (priority: AnnouncementPriority) => {
		switch (priority) {
			case AnnouncementPriority.Urgent:
				return (
					<Badge className="bg-red-500/10 text-red-600 border-none">
						Urgent
					</Badge>
				);
			case AnnouncementPriority.High:
				return (
					<Badge className="bg-amber-500/10 text-amber-600 border-none">
						High
					</Badge>
				);
			case AnnouncementPriority.Normal:
				return (
					<Badge className="bg-blue-500/10 text-blue-600 border-none">
						Normal
					</Badge>
				);
			case AnnouncementPriority.Low:
				return (
					<Badge className="bg-muted text-muted-foreground border-none">
						Low
					</Badge>
				);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-10"
		>
			{/* Header */}
			<PageHeader
				title={t("communication_hub") || "Communication Hub"}
				subtitle="Broadcast announcements and manage school notifications."
				icon={Megaphone}
			>
				<Button
					onClick={() => setIsCreateModalOpen(true)}
					className="gap-2"
				>
					<Plus className="h-4 w-4" />
					{t("new_announcement") || "New Announcement"}
				</Button>
			</PageHeader>

			{/* Main Content */}
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Sidebar/Filters */}
				<div className="w-full lg:w-72 space-y-4">
					<SearchInput
						placeholder="Search announcements..."
						value={searchQuery}
						onChange={setSearchQuery}
					/>

					<Card className="p-4 space-y-3">
						<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
							<Filter className="w-3 h-3" />
							Filter by Audience
						</h3>
						<div className="space-y-0.5">
							{[
								"All Announcements",
								"Whole School",
								"Specific Grades",
								"Specific Classes",
							].map((label) => (
								<Button
									key={label}
									variant="ghost"
									className="justify-start w-full h-9 px-3 text-sm"
								>
									{label}
								</Button>
							))}
						</div>
					</Card>
				</div>

				{/* Content Area */}
				<div className="flex-1 space-y-3">
					{isLoading ? (
						<LoadingState message="Loading announcements..." />
					) : filteredAnnouncements.length > 0 ? (
						<AnimatePresence>
							{filteredAnnouncements.map((announcement, idx) => (
								<motion.div
									key={announcement.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.05 }}
								>
									<Card
										className="p-5 hover:shadow-md transition-all border-l-4"
										style={{
											borderLeftColor:
												announcement.priority === AnnouncementPriority.Urgent
													? "#ef4444"
													: announcement.priority ===
														  AnnouncementPriority.High
														? "#f97316"
														: "#3b82f6",
										}}
									>
										<div className="space-y-3">
											<div className="flex flex-wrap items-center gap-2">
												{getPriorityBadge(announcement.priority)}
												<Badge
													variant="outline"
													className="text-xs uppercase tracking-wider"
												>
													{announcement.targetType ===
													AnnouncementTargetType.School
														? "Entire School"
														: announcement.targetType ===
															  AnnouncementTargetType.Grade
															? "Grades"
															: "Classes"}
												</Badge>
												<span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
													<Calendar className="w-3 h-3" />
													{format(
														new Date(announcement.createdAt),
														"MMM dd, yyyy · HH:mm"
													)}
												</span>
											</div>

											<h2 className="text-base font-semibold text-foreground">
												{announcement.title}
											</h2>

											<p className="text-sm text-muted-foreground leading-relaxed">
												{announcement.content}
											</p>

											<div className="pt-3 flex items-center justify-between border-t border-black/6 dark:border-white/6">
												<div className="flex items-center gap-2">
													<div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
														{announcement.authorName.substring(0, 2).toUpperCase()}
													</div>
													<div className="flex flex-col">
														<span className="text-xs font-medium">
															{announcement.authorName}
														</span>
														<span className="text-xs text-muted-foreground">
															Publisher
														</span>
													</div>
												</div>

												<Button
													variant="ghost"
													size="icon"
													onClick={() =>
														deleteAnnouncement(announcement.id)
													}
													className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</Card>
								</motion.div>
							))}
						</AnimatePresence>
					) : (
						<EmptyState
							icon={Bell}
							title="No Announcements Yet"
							description="Start by creating your first school-wide announcement."
							actionLabel="Create Announcement"
							onAction={() => setIsCreateModalOpen(true)}
						/>
					)}
				</div>
			</div>

			{/* Create Modal */}
			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Create Announcement</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<div className="space-y-2">
							<Label>Title</Label>
							<Input
								placeholder="Enter announcement title"
								value={newAnnouncement.title}
								onChange={(e) =>
									setNewAnnouncement({
										...newAnnouncement,
										title: e.target.value,
									})
								}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Target Audience</Label>
								<Select
									value={newAnnouncement.targetType}
									onValueChange={(val: any) =>
										setNewAnnouncement({
											...newAnnouncement,
											targetType: val,
										})
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select target" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={AnnouncementTargetType.School}>
											Entire School
										</SelectItem>
										<SelectItem value={AnnouncementTargetType.Grade}>
											Specific Grade
										</SelectItem>
										<SelectItem value={AnnouncementTargetType.Class}>
											Specific Class
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Priority</Label>
								<Select
									value={newAnnouncement.priority}
									onValueChange={(val: any) =>
										setNewAnnouncement({
											...newAnnouncement,
											priority: val,
										})
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select priority" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={AnnouncementPriority.Normal}>
											Normal
										</SelectItem>
										<SelectItem value={AnnouncementPriority.High}>
											High
										</SelectItem>
										<SelectItem value={AnnouncementPriority.Urgent}>
											Urgent
										</SelectItem>
										<SelectItem value={AnnouncementPriority.Low}>
											Low
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Content</Label>
							<Textarea
								placeholder="Write your announcement message here..."
								className="min-h-30 resize-none"
								value={newAnnouncement.content}
								onChange={(e) =>
									setNewAnnouncement({
										...newAnnouncement,
										content: e.target.value,
									})
								}
							/>
						</div>

						<div className="flex justify-end gap-3 pt-2">
							<Button
								variant="outline"
								onClick={() => setIsCreateModalOpen(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreate}
								disabled={
									!newAnnouncement.title || !newAnnouncement.content
								}
							>
								Publish
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}
