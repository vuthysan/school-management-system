"use client";

import { useState } from "react";
import {
	Megaphone,
	Plus,
	Search,
	Trash2,
	Calendar,
	Users,
	Filter,
	Loader2,
	AlertTriangle,
	Bell,
	Info,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function CommunicationPage() {
	const { t } = useLanguage();
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const {
		announcements,
		isLoading,
		createAnnouncement,
		deleteAnnouncement,
		refresh,
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
					<Badge
						variant="destructive"
						className="bg-red-500/20 text-red-500 border-red-500/30"
					>
						Urgent
					</Badge>
				);
			case AnnouncementPriority.High:
				return (
					<Badge
						variant="outline"
						className="bg-orange-500/20 text-orange-500 border-orange-500/30"
					>
						High
					</Badge>
				);
			case AnnouncementPriority.Normal:
				return (
					<Badge
						variant="default"
						className="bg-blue-500/20 text-blue-500 border-blue-500/30"
					>
						Normal
					</Badge>
				);
			case AnnouncementPriority.Low:
				return (
					<Badge
						variant="secondary"
						className="bg-gray-500/20 text-gray-500 border-gray-500/30"
					>
						Low
					</Badge>
				);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-20"
		>
			{/* Header */}
			<Card className="p-6 overflow-hidden relative group">
				<div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
					<Megaphone className="w-64 h-64 -mr-20 -mt-20 rotate-12" />
				</div>

				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
					<div className="flex items-center gap-5">
						<div className="p-4 bg-primary/10 rounded-2xl">
							<Megaphone className="w-8 h-8 text-primary" />
						</div>
						<div>
							<h1 className="text-3xl font-black tracking-tight text-foreground/90 uppercase">
								{t("communication_hub")}
							</h1>
							<p className="text-sm text-muted-foreground font-medium">
								Broadcast announcements and manage school notifications.
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Dialog
							open={isCreateModalOpen}
							onOpenChange={setIsCreateModalOpen}
						>
							<DialogTrigger asChild>
								<Button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all text-sm font-bold gap-2">
									<Plus className="w-5 h-5" />
									NEW ANNOUNCEMENT
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle className="text-xl font-black flex items-center gap-2">
										<Plus className="w-6 h-6 text-primary" />
										CREATE ANNOUNCEMENT
									</DialogTitle>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<label className="text-xs font-black text-muted-foreground uppercase tracking-wider">
											Title
										</label>
										<Input
											placeholder="Enter announcement title"
											value={newAnnouncement.title}
											onChange={(e) =>
												setNewAnnouncement({
													...newAnnouncement,
													title: e.target.value,
												})
											}
											className="rounded-xl h-12"
										/>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<label className="text-xs font-black text-muted-foreground uppercase tracking-wider">
												Target Audience
											</label>
											<Select
												value={newAnnouncement.targetType}
												onValueChange={(val: any) =>
													setNewAnnouncement({
														...newAnnouncement,
														targetType: val,
													})
												}
											>
												<SelectTrigger className="rounded-xl h-12">
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
											<label className="text-xs font-black text-muted-foreground uppercase tracking-wider">
												Priority
											</label>
											<Select
												value={newAnnouncement.priority}
												onValueChange={(val: any) =>
													setNewAnnouncement({
														...newAnnouncement,
														priority: val,
													})
												}
											>
												<SelectTrigger className="rounded-xl h-12">
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
										<label className="text-xs font-black text-muted-foreground uppercase tracking-wider">
											Content
										</label>
										<Textarea
											placeholder="Write your announcement message here..."
											className="min-h-[150px] rounded-xl resize-none"
											value={newAnnouncement.content}
											onChange={(e) =>
												setNewAnnouncement({
													...newAnnouncement,
													content: e.target.value,
												})
											}
										/>
									</div>

									<div className="flex justify-end gap-3 pt-4">
										<Button
											variant="outline"
											onClick={() => setIsCreateModalOpen(false)}
											className="rounded-xl h-12 px-8"
										>
											CANCEL
										</Button>
										<Button
											onClick={handleCreate}
											disabled={
												!newAnnouncement.title || !newAnnouncement.content
											}
											className="rounded-xl h-12 px-8 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
										>
											PUBLISH
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</Card>

			{/* Main Content */}
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Sidebar/Filters */}
				<div className="w-full lg:w-80 space-y-6">
					<Card className="p-4 space-y-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search announcements..."
								className="pl-9 rounded-xl h-11"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
								<Filter className="w-3 h-3" />
								Filter by Audience
							</h3>
							<div className="grid grid-cols-1 gap-1">
								<Button
									variant="ghost"
									className="justify-start h-10 px-3 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary"
								>
									All Announcements
								</Button>
								<Button
									variant="ghost"
									className="justify-start h-10 px-3 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary"
								>
									Whole School
								</Button>
								<Button
									variant="ghost"
									className="justify-start h-10 px-3 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary"
								>
									Specific Grades
								</Button>
								<Button
									variant="ghost"
									className="justify-start h-10 px-3 rounded-lg text-sm font-medium hover:bg-primary/5 hover:text-primary"
								>
									Specific Classes
								</Button>
							</div>
						</div>
					</Card>

					<Card className="p-5 bg-primary/5 border-primary/20 space-y-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/20 rounded-lg">
								<Info className="w-4 h-4 text-primary" />
							</div>
							<h3 className="text-sm font-bold">Audience Tips</h3>
						</div>
						<p className="text-xs text-muted-foreground leading-relaxed">
							Use **Whole School** for holiday notices. Target **Specific
							Grades** for exam schedules or graduation info.
						</p>
					</Card>
				</div>

				{/* Content Area */}
				<div className="flex-1 space-y-4">
					{isLoading ? (
						<div className="flex items-center justify-center py-20">
							<Loader2 className="w-8 h-8 animate-spin text-primary" />
						</div>
					) : filteredAnnouncements.length > 0 ? (
						<div className="grid grid-cols-1 gap-4">
							<AnimatePresence>
								{filteredAnnouncements.map((announcement, idx) => (
									<motion.div
										key={announcement.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: idx * 0.05 }}
									>
										<Card
											className="p-6 hover:shadow-xl transition-all border-l-4 group"
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
											<div className="flex justify-between gap-4">
												<div className="space-y-3 flex-1">
													<div className="flex flex-wrap items-center gap-2">
														{getPriorityBadge(announcement.priority)}
														<Badge
															variant="outline"
															className="rounded-md font-medium text-[10px] uppercase tracking-wider"
														>
															{announcement.targetType ===
															AnnouncementTargetType.School
																? "Entire School"
																: announcement.targetType ===
																	  AnnouncementTargetType.Grade
																	? "Grades"
																	: "Classes"}
														</Badge>
														<span className="text-[10px] font-black text-muted-foreground/60 flex items-center gap-1 ml-auto">
															<Calendar className="w-3 h-3" />
															{format(
																new Date(announcement.createdAt),
																"MMM dd, yyyy · HH:mm"
															)}
														</span>
													</div>

													<h2 className="text-xl font-black text-foreground/90 group-hover:text-primary transition-colors">
														{announcement.title}
													</h2>

													<p className="text-sm text-muted-foreground leading-relaxed">
														{announcement.content}
													</p>

													<div className="pt-4 flex items-center justify-between border-t border-border/50">
														<div className="flex items-center gap-2">
															<div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black uppercase">
																{announcement.authorName.substring(0, 2)}
															</div>
															<div className="flex flex-col">
																<span className="text-xs font-bold">
																	{announcement.authorName}
																</span>
																<span className="text-[10px] text-muted-foreground">
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
															className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</div>
											</div>
										</Card>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
							<div className="p-6 bg-muted rounded-full">
								<Bell className="w-12 h-12 text-muted-foreground/40" />
							</div>
							<div className="space-y-1">
								<h3 className="text-xl font-bold">No Announcements Yet</h3>
								<p className="text-sm text-muted-foreground">
									Start by creating your first school-wide announcement.
								</p>
							</div>
							<Button
								onClick={() => setIsCreateModalOpen(true)}
								className="rounded-xl h-11 px-8 gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
							>
								<Plus className="w-5 h-5" />
								CREATE ANNOUNCEMENT
							</Button>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
}
