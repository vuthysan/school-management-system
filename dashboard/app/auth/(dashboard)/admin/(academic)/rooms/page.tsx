"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Plus,
	Loader2,
	Building2,
	Users,
	Pencil,
	Trash2,
	MapPin,
	DoorOpen,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { LoadingState } from "@/components/dashboard/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";
import { useLookupValues } from "@/hooks/useLookupValues";
import {
	useRooms,
	useRoomMutations,
	Room,
	CreateRoomInput,
} from "@/hooks/useRooms";

const DEFAULT_ROOM_TYPES = [
	"Classroom",
	"Lab",
	"Library",
	"Auditorium",
	"Office",
	"Other",
];
const ROOM_STATUSES = ["Available", "Occupied", "Maintenance"] as const;

export default function RoomsPage() {
	const { t } = useLanguage();
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const { rooms, isLoading, error, refresh } = useRooms(schoolId);
	const { createRoom, updateRoom, deleteRoom } = useRoomMutations();
	const { getValues } = useLookupValues(schoolId);
	const ROOM_TYPES = getValues("room_types").length > 0 ? getValues("room_types") : DEFAULT_ROOM_TYPES;

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingRoom, setEditingRoom] = useState<Room | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		name: "",
		building: "",
		floor: "",
		capacity: "",
		roomType: "Classroom" as string,
		status: "Available" as string,
		description: "",
	});

	const handleOpenAdd = () => {
		setEditingRoom(null);
		setFormData({
			name: "",
			building: "",
			floor: "",
			capacity: "",
			roomType: "Classroom",
			status: "Available",
			description: "",
		});
		setIsDialogOpen(true);
	};

	const handleOpenEdit = (room: Room) => {
		setEditingRoom(room);
		setFormData({
			name: room.name,
			building: room.building || "",
			floor: room.floor || "",
			capacity: room.capacity?.toString() || "",
			roomType: room.roomType || "Classroom",
			status: room.status || "Available",
			description: room.description || "",
		});
		setIsDialogOpen(true);
	};

	const handleSave = async () => {
		if (!schoolId || !formData.name) return;

		setIsSaving(true);
		try {
			const input: CreateRoomInput = {
				schoolId,
				name: formData.name,
				building: formData.building || undefined,
				floor: formData.floor || undefined,
				capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
				roomType: formData.roomType,
				status: formData.status,
				description: formData.description || undefined,
			};

			if (editingRoom) {
				await updateRoom(editingRoom.id, input);
			} else {
				await createRoom(input);
			}

			setIsDialogOpen(false);
			refresh();
		} catch (err) {
			console.error("Failed to save room:", err);
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteClick = (room: Room) => {
		setRoomToDelete(room);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!roomToDelete) return;
		setIsDeleting(true);
		try {
			await deleteRoom(roomToDelete.id);
			setDeleteDialogOpen(false);
			setRoomToDelete(null);
			refresh();
		} catch (err) {
			console.error("Failed to delete room:", err);
		} finally {
			setIsDeleting(false);
		}
	};

	const getStatusBadge = (status?: string) => {
		switch (status) {
			case "Available":
				return (
					<Badge className="bg-emerald-500/10 text-emerald-600 border-none">
						{t("available")}
					</Badge>
				);
			case "Occupied":
				return (
					<Badge className="bg-blue-500/10 text-blue-600 border-none">
						{t("occupied")}
					</Badge>
				);
			case "Maintenance":
				return (
					<Badge className="bg-amber-500/10 text-amber-600 border-none">
						{t("maintenance")}
					</Badge>
				);
			default:
				return <Badge variant="outline">{status || t("status")}</Badge>;
		}
	};

	if (isLoading) {
		return <LoadingState message={t("loading")} />;
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-10"
		>
			{/* Header */}
			<PageHeader
				title={t("rooms_management")}
				subtitle={t("manage_school_rooms")}
				icon={DoorOpen}
			>
				<Button onClick={handleOpenAdd} className="gap-2">
					<Plus className="h-4 w-4" />
					{t("add_room")}
				</Button>
			</PageHeader>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard
					title={t("total_rooms")}
					value={rooms.length}
					icon={DoorOpen}
					color="blue"
					delay={0}
				/>
				<StatsCard
					title={t("available")}
					value={rooms.filter((r) => r.status === "Available").length}
					icon={Building2}
					color="green"
					delay={0.1}
				/>
				<StatsCard
					title={t("total_capacity")}
					value={rooms.reduce((sum, r) => sum + (r.capacity || 0), 0)}
					icon={Users}
					color="purple"
					delay={0.2}
				/>
				<StatsCard
					title={t("buildings")}
					value={
						new Set(rooms.map((r) => r.building).filter(Boolean)).size
					}
					icon={MapPin}
					color="orange"
					delay={0.3}
				/>
			</div>

			{/* Rooms Table */}
			<Card>
				<CardContent className="p-0">
					{rooms.length === 0 ? (
						<EmptyState
							icon={Building2}
							title={t("no_rooms_added")}
							description={t("no_rooms_desc")}
							actionLabel={t("add_first_room")}
							onAction={handleOpenAdd}
						/>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("name")}</TableHead>
									<TableHead>{t("type")}</TableHead>
									<TableHead>{t("building")}</TableHead>
									<TableHead>{t("floor")}</TableHead>
									<TableHead>{t("capacity")}</TableHead>
									<TableHead>{t("status")}</TableHead>
									<TableHead className="text-right">{t("actions")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rooms.map((room) => (
									<TableRow key={room.id}>
										<TableCell className="font-medium">{room.name}</TableCell>
										<TableCell>
											<Badge variant="outline">
												{room.roomType || "Classroom"}
											</Badge>
										</TableCell>
										<TableCell>{room.building || "-"}</TableCell>
										<TableCell>{room.floor || "-"}</TableCell>
										<TableCell>{room.capacity || "-"}</TableCell>
										<TableCell>{getStatusBadge(room.status)}</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-1">
												<Button
													size="icon"
													variant="ghost"
													onClick={() => handleOpenEdit(room)}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													size="icon"
													variant="ghost"
													className="text-destructive hover:text-destructive"
													onClick={() => handleDeleteClick(room)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Add/Edit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingRoom ? t("edit_room") : t("add_new_room")}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label>{t("room_name")} *</Label>
							<Input
								placeholder="e.g., Room 101"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>{t("room_type")}</Label>
								<Select
									value={formData.roomType}
									onValueChange={(v) =>
										setFormData({ ...formData, roomType: v })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{ROOM_TYPES.map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>{t("status")}</Label>
								<Select
									value={formData.status}
									onValueChange={(v) => setFormData({ ...formData, status: v })}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{ROOM_STATUSES.map((status) => (
											<SelectItem key={status} value={status}>
												{status}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>{t("building")}</Label>
								<Input
									placeholder="e.g., Building A"
									value={formData.building}
									onChange={(e) =>
										setFormData({ ...formData, building: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>{t("floor")}</Label>
								<Input
									placeholder="e.g., 1st Floor"
									value={formData.floor}
									onChange={(e) =>
										setFormData({ ...formData, floor: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label>{t("capacity")}</Label>
							<Input
								type="number"
								placeholder="e.g., 30"
								value={formData.capacity}
								onChange={(e) =>
									setFormData({ ...formData, capacity: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t("description")}</Label>
							<Input
								placeholder={t("optional_description")}
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
							{t("cancel")}
						</Button>
						<Button disabled={isSaving || !formData.name} onClick={handleSave}>
							{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							{editingRoom ? t("update") : t("create")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title={t("delete_room")}
				description={t("delete_room_confirm", { name: roomToDelete?.name || "" })}
				onConfirm={handleDeleteConfirm}
				isLoading={isDeleting}
			/>
		</motion.div>
	);
}
