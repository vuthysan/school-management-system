"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { Loader2 } from "lucide-react";
import type { Book, BookCategory } from "@/types/library";

interface BookFormProps {
	initialData?: Book | null;
	onSave: (data: {
		title: string;
		author: string;
		isbn?: string;
		category?: BookCategory;
		publisher?: string;
		publishedYear?: number;
		totalCopies: number;
		location?: string;
		description?: string;
		status?: string;
	}) => Promise<void>;
	onCancel: () => void;
	isSaving: boolean;
}

export function BookForm({ initialData, onSave, onCancel, isSaving }: BookFormProps) {
	const { t } = useTranslation();

	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [isbn, setIsbn] = useState("");
	const [category, setCategory] = useState<BookCategory>("Other");
	const [publisher, setPublisher] = useState("");
	const [publishedYear, setPublishedYear] = useState("");
	const [totalCopies, setTotalCopies] = useState(1);
	const [location, setLocation] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("Active");

	useEffect(() => {
		if (initialData) {
			setTitle(initialData.title);
			setAuthor(initialData.author);
			setIsbn(initialData.isbn || "");
			setCategory(initialData.category);
			setPublisher(initialData.publisher || "");
			setPublishedYear(initialData.publishedYear?.toString() || "");
			setTotalCopies(initialData.totalCopies);
			setLocation(initialData.location || "");
			setDescription(initialData.description || "");
			setStatus(initialData.status);
		} else {
			setTitle("");
			setAuthor("");
			setIsbn("");
			setCategory("Other");
			setPublisher("");
			setPublishedYear("");
			setTotalCopies(1);
			setLocation("");
			setDescription("");
			setStatus("Active");
		}
	}, [initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSave({
			title,
			author,
			isbn: isbn || undefined,
			category,
			publisher: publisher || undefined,
			publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
			totalCopies,
			location: location || undefined,
			description: description || undefined,
			status,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="title">{t("book_title") || "Title"} *</Label>
					<Input
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder={t("book_title_placeholder") || "e.g. Introduction to Physics"}
						required
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="author">{t("author") || "Author"} *</Label>
					<Input
						id="author"
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						placeholder={t("author_placeholder") || "e.g. John Smith"}
						required
						className="h-9"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="isbn">{t("isbn") || "ISBN"}</Label>
					<Input
						id="isbn"
						value={isbn}
						onChange={(e) => setIsbn(e.target.value)}
						placeholder="978-0-000-00000-0"
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label>{t("category") || "Category"}</Label>
					<Select value={category} onValueChange={(v) => setCategory(v as BookCategory)}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Textbook">{t("textbook") || "Textbook"}</SelectItem>
							<SelectItem value="Reference">{t("reference") || "Reference"}</SelectItem>
							<SelectItem value="Fiction">{t("fiction") || "Fiction"}</SelectItem>
							<SelectItem value="NonFiction">{t("non_fiction") || "Non-Fiction"}</SelectItem>
							<SelectItem value="Magazine">{t("magazine") || "Magazine"}</SelectItem>
							<SelectItem value="Other">{t("other") || "Other"}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="publisher">{t("publisher") || "Publisher"}</Label>
					<Input
						id="publisher"
						value={publisher}
						onChange={(e) => setPublisher(e.target.value)}
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="publishedYear">{t("published_year") || "Year"}</Label>
					<Input
						id="publishedYear"
						type="number"
						value={publishedYear}
						onChange={(e) => setPublishedYear(e.target.value)}
						placeholder="2024"
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="totalCopies">{t("total_copies") || "Total Copies"} *</Label>
					<Input
						id="totalCopies"
						type="number"
						value={totalCopies}
						onChange={(e) => setTotalCopies(parseInt(e.target.value) || 1)}
						min={1}
						required
						className="h-9"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="location">{t("shelf_location") || "Shelf / Location"}</Label>
					<Input
						id="location"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						placeholder={t("location_placeholder") || "e.g. Shelf A-3"}
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label>{t("status") || "Status"}</Label>
					<Select value={status} onValueChange={setStatus}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Active">{t("active") || "Active"}</SelectItem>
							<SelectItem value="Inactive">{t("inactive") || "Inactive"}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">{t("description") || "Description"}</Label>
				<Input
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder={t("description_placeholder") || "Optional description..."}
					className="h-9"
				/>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
					{t("cancel")}
				</Button>
				<Button type="submit" disabled={isSaving || !title || !author}>
					{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{initialData ? t("save_changes") || "Save Changes" : t("add_book") || "Add Book"}
				</Button>
			</div>
		</form>
	);
}
