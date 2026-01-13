"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { BookOpen, Search, Plus, Bookmark, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LibraryPage() {
	return (
		<div className="p-6 space-y-10 max-w-[1600px] mx-auto bg-background/50">
			<PageHeader
				title="Library Management"
				subtitle="Manage your school's library collection and tracking borrowing records."
				icon={BookOpen}
				gradient="blue"
			>
				<Button className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 bg-blue-500 hover:bg-blue-600 border-none transition-all hover:scale-105 active:scale-95">
					<Plus className="w-5 h-5 mr-2" strokeWidth={3} />
					Add New Book
				</Button>
			</PageHeader>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{[
					{
						label: "Total Books",
						value: "12,450",
						sub: "+120 this month",
						color: "blue",
					},
					{
						label: "Borrowed",
						value: "842",
						sub: "Currently out",
						color: "purple",
					},
					{
						label: "Overdue",
						value: "24",
						sub: "Needs attention",
						color: "orange",
					},
					{
						label: "Active Members",
						value: "1,120",
						sub: "Students & Staff",
						color: "green",
					},
				].map((stat, i) => (
					<DashboardCard key={i} delay={i * 0.1}>
						<div className="space-y-1">
							<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
								{stat.label}
							</p>
							<p className="text-3xl font-black text-foreground">
								{stat.value}
							</p>
							<p className="text-[10px] font-bold text-muted-foreground/40">
								{stat.sub}
							</p>
						</div>
					</DashboardCard>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-6">
					<DashboardCard title="Books Catalog">
						<div className="space-y-6">
							<div className="relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search by title, author, or ISBN..."
									className="pl-12 h-12 rounded-2xl bg-black/5 border-none"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{[
									{
										title: "Quantum Physics",
										author: "Dr. Richard Feynman",
										status: "Available",
										color: "text-green-500",
									},
									{
										title: "World History Vol 2",
										author: "Jane Doe",
										status: "Borrowed",
										color: "text-blue-500",
									},
									{
										title: "Advanced Calculus",
										author: "Isaac Newton",
										status: "Available",
										color: "text-green-500",
									},
									{
										title: "Literature & Arts",
										author: "Various Authors",
										status: "Overdue",
										color: "text-orange-500",
									},
								].map((book, i) => (
									<div
										key={i}
										className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-black/5 hover:border-primary/20 smooth-transition glass-card"
									>
										<div className="flex items-start justify-between mb-2">
											<div className="font-bold truncate max-w-[150px]">
												{book.title}
											</div>
											<span
												className={`text-[9px] font-black uppercase tracking-widest ${book.color}`}
											>
												{book.status}
											</span>
										</div>
										<p className="text-xs text-muted-foreground mb-4">
											{book.author}
										</p>
										<div className="flex gap-2">
											<Button
												variant="ghost"
												className="h-8 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5"
											>
												Details
											</Button>
											<Button className="h-8 text-[10px] font-black uppercase tracking-widest bg-black dark:bg-white text-white dark:text-black">
												Borrow
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					</DashboardCard>
				</div>

				<div className="space-y-6">
					<DashboardCard title="Recent Borrows">
						<div className="space-y-4">
							{[
								{
									user: "John Smith",
									book: "Chemistry Lab",
									time: "2 hours ago",
								},
								{
									user: "Sarah Wilson",
									book: "English Grammar",
									time: "4 hours ago",
								},
								{ user: "Mike Johnson", book: "Modern Art", time: "Yesterday" },
							].map((item, i) => (
								<div
									key={i}
									className="flex items-center gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5"
								>
									<div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
										<User className="w-5 h-5" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-bold truncate">{item.user}</p>
										<p className="text-[10px] text-muted-foreground truncate">
											{item.book}
										</p>
									</div>
									<div className="text-[9px] font-bold text-muted-foreground/40">
										{item.time}
									</div>
								</div>
							))}
						</div>
					</DashboardCard>

					<DashboardCard
						title="Quick Options"
						className="bg-orange-500/5 border-orange-500/20"
					>
						<div className="space-y-2">
							<Button
								variant="ghost"
								className="w-full justify-start rounded-xl h-10 hover:bg-orange-500/10 text-orange-600 font-bold group"
							>
								<Bookmark className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" />
								Reservations
							</Button>
							<Button
								variant="ghost"
								className="w-full justify-start rounded-xl h-10 hover:bg-orange-500/10 text-orange-600 font-bold group"
							>
								<Clock className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" />
								Due Today
							</Button>
						</div>
					</DashboardCard>
				</div>
			</div>
		</div>
	);
}
