// Library GraphQL Queries and Mutations

export const BOOK_FIELDS = `
	id
	schoolId
	title
	author
	isbn
	category
	publisher
	publishedYear
	totalCopies
	availableCopies
	location
	description
	status
	createdAt
	updatedAt
`;

export const BORROW_RECORD_FIELDS = `
	id
	schoolId
	bookId
	borrowerId
	borrowerName
	borrowerType
	borrowDate
	dueDate
	returnDate
	borrowStatus
	notes
	createdAt
	updatedAt
`;

export const LIBRARY_QUERIES = {
	GET_BOOKS: `
		query GetBooks($schoolId: String!, $page: Int, $pageSize: Int, $filter: BookFilterInput) {
			books(schoolId: $schoolId, page: $page, pageSize: $pageSize, filter: $filter) {
				items {
					${BOOK_FIELDS}
				}
				total
				page
				totalPages
			}
		}
	`,

	GET_BOOK: `
		query GetBook($id: String!) {
			book(id: $id) {
				${BOOK_FIELDS}
			}
		}
	`,

	GET_BORROW_RECORDS: `
		query GetBorrowRecords($schoolId: String!, $page: Int, $pageSize: Int, $filter: BorrowFilterInput) {
			borrowRecords(schoolId: $schoolId, page: $page, pageSize: $pageSize, filter: $filter) {
				items {
					${BORROW_RECORD_FIELDS}
				}
				total
				page
				totalPages
			}
		}
	`,
};

export const LIBRARY_MUTATIONS = {
	CREATE_BOOK: `
		mutation CreateBook($input: CreateBookInput!) {
			createBook(input: $input) {
				${BOOK_FIELDS}
			}
		}
	`,

	UPDATE_BOOK: `
		mutation UpdateBook($id: String!, $input: UpdateBookInput!) {
			updateBook(id: $id, input: $input) {
				${BOOK_FIELDS}
			}
		}
	`,

	DELETE_BOOK: `
		mutation DeleteBook($id: String!) {
			deleteBook(id: $id)
		}
	`,

	CREATE_BORROW_RECORD: `
		mutation CreateBorrowRecord($input: CreateBorrowRecordInput!) {
			createBorrowRecord(input: $input) {
				${BORROW_RECORD_FIELDS}
			}
		}
	`,

	UPDATE_BORROW_RECORD: `
		mutation UpdateBorrowRecord($id: String!, $input: UpdateBorrowRecordInput!) {
			updateBorrowRecord(id: $id, input: $input) {
				${BORROW_RECORD_FIELDS}
			}
		}
	`,

	DELETE_BORROW_RECORD: `
		mutation DeleteBorrowRecord($id: String!) {
			deleteBorrowRecord(id: $id)
		}
	`,

	RETURN_BOOK: `
		mutation ReturnBook($id: String!) {
			returnBook(id: $id) {
				${BORROW_RECORD_FIELDS}
			}
		}
	`,
};
