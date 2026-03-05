export type BookCategory = "Textbook" | "Reference" | "Fiction" | "NonFiction" | "Magazine" | "Other";
export type BorrowStatus = "Borrowed" | "Returned" | "Overdue";
export type BorrowerType = "Student" | "Staff";

export interface Book {
	id: string;
	schoolId: string;
	title: string;
	author: string;
	isbn?: string;
	category: BookCategory;
	publisher?: string;
	publishedYear?: number;
	totalCopies: number;
	availableCopies: number;
	location?: string;
	description?: string;
	status: "Active" | "Inactive";
	createdAt: string;
	updatedAt: string;
}

export interface BorrowRecord {
	id: string;
	schoolId: string;
	bookId: string;
	borrowerId: string;
	borrowerName: string;
	borrowerType: BorrowerType;
	borrowDate: string;
	dueDate: string;
	returnDate?: string;
	borrowStatus: BorrowStatus;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateBookInput {
	schoolId: string;
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
}

export interface UpdateBookInput {
	title?: string;
	author?: string;
	isbn?: string;
	category?: BookCategory;
	publisher?: string;
	publishedYear?: number;
	totalCopies?: number;
	availableCopies?: number;
	location?: string;
	description?: string;
	status?: string;
}

export interface CreateBorrowRecordInput {
	schoolId: string;
	bookId: string;
	borrowerId: string;
	borrowerName: string;
	borrowerType?: BorrowerType;
	borrowDate: string;
	dueDate: string;
	notes?: string;
}

export interface UpdateBorrowRecordInput {
	dueDate?: string;
	borrowStatus?: BorrowStatus;
	notes?: string;
}
