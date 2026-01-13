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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";
import {
	useRooms,
	useRoomMutations,
	Room,
	CreateRoomInput,
} from "@/hooks/useRooms";

const ROOM_TYPES = [
	"Classroom",
	"Lab",
	"Library",
	"Auditorium",
	"Office",
	"Other",
] as const;
const ROOM_STATUSES = ["Available", "Occupied", "Maintenance"] as const;

export default function RoomsPage() {
	const { t } = useLanguage();
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const { rooms, isLoading, error, refresh } = useRooms(schoolId);
	const { createRoom, updateRoom, deleteRoom } = useRoomMutations();

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingRoom, setEditingRoom] = useState<Room | null>(null);
	const [isSaving, setIsSaving] = useState(false);

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
			alert(err instanceof Error ? err.message : "Failed to save room");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async (room: Room) => {
		if (!confirm(`Delete room "${room.name}"?`)) return;

		try {
			await deleteRoom(room.id);
			refresh();
		} catch (err) {
			console.error("Failed to delete room:", err);
			alert(err instanceof Error ? err.message : "Failed to delete room");
		}
	};

	const getStatusBadge = (status?: string) => {
		switch (status) {
			case "Available":
				return <Badge className="bg-green-500">Available</Badge>;
			case "Occupied":
				return <Badge className="bg-blue-500">Occupied</Badge>;
			case "Maintenance":
				return <Badge className="bg-orange-500">Maintenance</Badge>;
			default:
				return <Badge variant="outline">{status || "Unknown"}</Badge>;
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div>
					<h1 className="text-3xl font-bold">
						{t("rooms_management") || "Rooms & Classrooms"}
					</h1>
					<p className="text-muted-foreground mt-1">
						{t("manage_school_rooms") ||
							"Manage classrooms, labs, and facilities"}
					</p>
				</div>
				<Button onClick={handleOpenAdd}>
					<Plus className="h-4 w-4 mr-2" />
					{t("add_room") || "Add Room"}
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="flex items-center gap-4 p-6">
						<div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
							<DoorOpen className="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total Rooms</p>
							<p className="text-2xl font-bold">{rooms.length}</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-6">
						<div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
							<Building2 className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Available</p>
							<p className="text-2xl font-bold">
								{rooms.filter((r) => r.status === "Available").length}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-6">
						<div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
							<Users className="h-6 w-6 text-purple-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total Capacity</p>
							<p className="text-2xl font-bold">
								{rooms.reduce((sum, r) => sum + (r.capacity || 0), 0)}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center gap-4 p-6">
						<div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
							<MapPin className="h-6 w-6 text-orange-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Buildings</p>
							<p className="text-2xl font-bold">
								{new Set(rooms.map((r) => r.building).filter(Boolean)).size}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Rooms Table */}
			<Card>
				<CardContent className="p-0">
					{rooms.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Building2 className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold">No Rooms Added</h3>
							<p className="text-muted-foreground max-w-sm mt-1">
								Start by adding classrooms, labs, and other facilities.
							</p>
							<Button className="mt-4" onClick={handleOpenAdd}>
								<Plus className="h-4 w-4 mr-2" />
								Add First Room
							</Button>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Building</TableHead>
									<TableHead>Floor</TableHead>
									<TableHead>Capacity</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
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
											<div className="flex justify-end gap-2">
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
													onClick={() => handleDelete(room)}
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
							{editingRoom ? "Edit Room" : "Add New Room"}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label>Room Name *</Label>
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
								<Label>Room Type</Label>
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
								<Label>Status</Label>
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
								<Label>Building</Label>
								<Input
									placeholder="e.g., Building A"
									value={formData.building}
									onChange={(e) =>
										setFormData({ ...formData, building: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Floor</Label>
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
							<Label>Capacity</Label>
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
							<Label>Description</Label>
							<Input
								placeholder="Optional description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
							Cancel
						</Button>
						<Button disabled={isSaving || !formData.name} onClick={handleSave}>
							{isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
							{editingRoom ? "Update" : "Create"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
